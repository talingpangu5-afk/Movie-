'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { X, ArrowLeft, Mail, Copy, Check, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export function EarthZoomContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<'idle' | 'zooming' | 'landed'>('idle');
  const stageRef = useRef(stage);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const [showMailUi, setShowMailUi] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [enableScroll, setEnableScroll] = useState(true);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = window.innerWidth;
    const height = window.innerHeight * 0.45 || 300;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 2000);
    camera.position.z = 200;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      precision: 'highp',
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // TEXTURES
    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const cloudTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png');
    const starTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/sprites/disc.png');

    // EARTH
    const earthGeo = new THREE.SphereGeometry(75, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      shininess: 5,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);
    earthRef.current = earth;

    // CLOUDS
    const cloudGeo = new THREE.SphereGeometry(75.8, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.4
    });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);
    cloudsRef.current = clouds;

    // ATMOSPHERE GLOW
    const glowGeo = new THREE.SphereGeometry(78.5, 64, 64);
    const glowMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00f2ff) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize( normalMatrix * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow( 0.7 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 3.0 );
          gl_FragColor = vec4( glowColor, intensity );
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // STARS
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArr = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      posArr[i] = (Math.random() - 0.5) * 3000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    const starMat = new THREE.PointsMaterial({
      size: 2,
      map: starTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      color: 0xaaaaaa
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(500, 300, 500);
    scene.add(sunLight);

    // RENDER LOOP
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      const currentStage = stageRef.current;

      if (earthRef.current && cloudsRef.current && currentStage === 'idle') {
        earthRef.current.rotation.y += 0.001;
        cloudsRef.current.rotation.y += 0.0015;
      }

      if (starsRef.current) {
        starsRef.current.rotation.y += 0.0001;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    // RESIZE
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      const w = window.innerWidth;
      const h = window.innerHeight * 0.45 || 300;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      
      // Proper Cleanup
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  const startZoom = () => {
    if (stage !== 'idle') return;
    setStage('zooming');
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        setStage('landed');
        document.body.style.overflow = 'auto';
      }
    });

    // Step 1: Deep space entry
    tl.to(cameraRef.current!.position, {
      z: 500,
      duration: 1,
      ease: 'power2.inOut'
    });

    // Step 2 & 4: Earth approach & target zoom
    // Coords for Kaying Village are roughly lat 28.4, lon 94.6
    // We rotate Earth to face camera
    const targetRotY = THREE.MathUtils.degToRad(-94.6);
    const targetRotX = THREE.MathUtils.degToRad(28.4);

    tl.to(earthRef.current!.rotation, {
      y: targetRotY,
      x: targetRotX,
      duration: 2.5,
      ease: 'expo.inOut'
    }, "-=0.5");

    tl.to(cameraRef.current!.position, {
      z: 82,
      duration: 3,
      ease: 'expo.inOut'
    }, "<");

    // Seamless morph transition (opacity fade)
    tl.to(containerRef.current, {
      opacity: 1, // Placeholder for whatever we might want to fade in
      duration: 0.5
    });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('arunpangu81125@gmail.com');
    setIsCopied(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const reset = () => {
    setStage('idle');
    setShowMailUi(false);
    if (cameraRef.current) cameraRef.current.position.z = 200;
    document.body.style.overflow = 'auto';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[35vh] md:h-[45vh] overflow-hidden bg-black select-none z-40 border-b border-white/5"
      style={{ margin: 0, padding: 0 }}
    >
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 cursor-pointer transition-opacity duration-1000 ${stage === 'landed' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={startZoom}
      />

      {/* Overlay Text */}
      <AnimatePresence>
        {stage === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
          >
            <div className="text-center px-4 mb-4">
               <motion.h2 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.3, duration: 0.8 }}
                 className="text-lg md:text-3xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.9)]"
               >
                 Contact after transfer <span className="text-[#f7931a] drop-shadow-[0_0_10px_rgba(247,147,26,0.6)]">BTC 0.00001</span>
               </motion.h2>
               <div className="flex flex-col items-center justify-center gap-1 mt-2">
                 <div className="flex items-center gap-2 text-white/30 text-[9px] uppercase tracking-[0.3em] font-bold">
                   <MousePointer2 className="w-2.5 h-2.5 animate-bounce" />
                   <span>Access Transmission</span>
                 </div>
               </div>
            </div>

            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="relative group mt-auto mb-10"
              onClick={startZoom}
            >
              <div className="absolute inset-0 bg-primary blur-lg opacity-10 group-hover:opacity-30 transition-opacity" />
              <div className="relative px-8 py-3 bg-primary/5 backdrop-blur-md rounded-full border border-primary/30 text-primary text-[10px] font-black tracking-[0.6em] uppercase cursor-pointer hover:bg-primary/20 hover:border-primary transition-all pointer-events-auto">
                CLICK
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing State: Google Earth Fallback */}
      <AnimatePresence>
        {stage === 'landed' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black flex flex-col"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d11347.16!2d94.678!3d28.418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDI1JzA0LjciTiA5NMKwNDAnNDIuNyJF!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&maptype=satellite"
              className="w-full flex-1 border-none brightness-90 saturate-[1.2]"
              title="Kaying Village"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            {/* UI Overlay on G-Earth */}
            <div className="absolute top-24 left-6 flex gap-4 z-30">
              <button 
                onClick={reset}
                className="bg-black/60 backdrop-blur-md border border-white/10 p-3 rounded-full text-white hover:bg-white/20 hover:border-white/50 transition-all flex items-center gap-2 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] uppercase font-black tracking-widest pr-2">Back to Space</span>
              </button>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 w-full px-6 z-30">
              <motion.div 
                initial={{ scale: 0, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="relative w-full max-w-lg"
              >
                {/* Marker Pulse */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                   <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-primary rounded-full shadow-[0_0_20px_#00f2ff]" />
                   </div>
                   <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[12px] font-black uppercase tracking-widest shadow-2xl">Kaying Village</span>
                   </div>
                </div>

                <div 
                  className="mt-28 flex flex-col items-center gap-4 text-center"
                >
                  <p className="text-[11px] uppercase tracking-[0.4em] text-white/50 font-black mb-2 animate-pulse">Transmission Secured</p>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Send your details:</p>
                    <div className="flex items-center gap-4 group cursor-pointer" onClick={copyEmail}>
                      <motion.div 
                        animate={{ 
                          translateY: [0, -5, 0],
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all"
                      >
                        <Mail className="w-6 h-6 text-primary" />
                      </motion.div>
                      <span className="text-2xl md:text-3xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">
                        arunpangu81125@gmail.com
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={copyEmail}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 hover:border-primary/40 transition-all group mt-2"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />}
                    <span className="text-[10px] uppercase font-black tracking-[.2em] text-white/60 group-hover:text-white transition-colors">
                      {isCopied ? 'Copied to clipboard' : 'Click to copy email'}
                    </span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <AnimatePresence>
        {stage === 'zooming' && (
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStage('landed')}
            className="absolute top-24 right-6 z-[60] bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] uppercase font-black tracking-widest text-white hover:bg-red-500 hover:border-red-500 transition-all"
          >
            Skip Animation
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Cinematic Borders */}
      <div className="absolute top-0 left-0 w-full h-[5%] bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 w-full h-[5%] bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
