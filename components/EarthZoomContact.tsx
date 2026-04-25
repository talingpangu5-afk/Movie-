'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ArrowLeft, Mail, Copy, Check, MousePointer2 } from 'lucide-react';
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

  const [isCopied, setIsCopied] = useState(false);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = canvasRef.current.clientWidth;
    const height = canvasRef.current.clientHeight;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
    camera.position.z = 160;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      precision: 'mediump',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const cloudTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png');
    const nightTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg');

    // EARTH
    const earthGeo = new THREE.SphereGeometry(60, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({ 
      map: earthTexture, 
      specular: new THREE.Color(0x333333),
      shininess: 15,
      bumpScale: 1
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);
    earthRef.current = earth;

    // CLOUDS
    const cloudGeo = new THREE.SphereGeometry(60.6, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true, opacity: 0.45 });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    scene.add(clouds);
    cloudsRef.current = clouds;

    // ATMOSPHERE (Realistic Glow)
    const atmosGeo = new THREE.SphereGeometry(66, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00f2ff) },
        viewVector: { value: camera.position }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize( normalMatrix * normal );
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          float intensity = pow( 0.7 - dot( vNormal, normalize( vViewPosition ) ), 3.0 );
          gl_FragColor = vec4( glowColor, intensity );
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphere);

    // 8 SURROUNDING PLANETS
    const planets: THREE.Mesh[] = [];
    const planetData = [
      { size: 8, color: 0x888888, dist: 120, speed: 0.005, offset: 0 }, // Mercury-like
      { size: 12, color: 0xffcc99, dist: 150, speed: 0.003, offset: 1.2 }, // Venus-like
      { size: 10, color: 0xff6633, dist: 180, speed: 0.002, offset: 2.5 }, // Mars-like
      { size: 25, color: 0xeeb882, dist: 240, speed: 0.001, offset: 3.8 }, // Jupiter-like
      { size: 20, color: 0xe3d4a4, dist: 300, speed: 0.0008, offset: 4.5 }, // Saturn-like
      { size: 15, color: 0xace5ee, dist: 350, speed: 0.0006, offset: 5.2 }, // Uranus-like
      { size: 14, color: 0x4b70dd, dist: 400, speed: 0.0005, offset: 0.8 }, // Neptune-like
      { size: 6, color: 0xcccccc, dist: 450, speed: 0.0004, offset: 2.0 }, // Pluto-like
    ];

    planetData.forEach(data => {
      const geo = new THREE.SphereGeometry(data.size, 32, 32);
      const mat = new THREE.MeshPhongMaterial({ color: data.color, shininess: 10 });
      const planet = new THREE.Mesh(geo, mat);
      
      // Initial position
      const angle = data.offset;
      planet.position.set(Math.cos(angle) * data.dist, (Math.random() - 0.5) * 50, Math.sin(angle) * data.dist);
      
      scene.add(planet);
      planets.push(planet);
    });

    // STARFIELD
    const starGeo = new THREE.BufferGeometry();
    const starCount = 2000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 1500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ size: 1, color: 0xffffff, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 100, 100);
    scene.add(sunLight);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (stageRef.current === 'idle') {
        if (earthRef.current) earthRef.current.rotation.y += 0.001;
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0015;
        
        stars.rotation.y += 0.0002;

        planets.forEach((planet, idx) => {
          const data = planetData[idx];
          const time = Date.now() * data.speed * 0.1 + data.offset;
          planet.position.x = Math.cos(time) * data.dist;
          planet.position.z = Math.sin(time) * data.dist;
          planet.rotation.y += 0.01;
        });
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = canvasRef.current.clientWidth;
      const h = canvasRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
    };
  }, []);

  const startZoom = () => {
    if (stage !== 'idle') return;
    setStage('zooming');
    document.body.style.overflow = 'hidden';
    const tl = gsap.timeline({ onComplete: () => { setStage('landed'); document.body.style.overflow = 'auto'; } });
    tl.to(cameraRef.current!.position, { z: 400, duration: 0.6 });
    tl.to(earthRef.current!.rotation, { y: THREE.MathUtils.degToRad(-94.6), x: THREE.MathUtils.degToRad(28.4), duration: 2, ease: 'expo.inOut' }, "-=0.1");
    tl.to(cameraRef.current!.position, { z: 65, duration: 2.2, ease: 'expo.inOut' }, "<");
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('arunpangu81125@gmail.com');
    setIsCopied(true);
    toast.success('Email copied!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const reset = () => {
    setStage('idle');
    if (cameraRef.current) cameraRef.current.position.z = 160;
  };

  return (
    <div className="w-full bg-gradient-to-b from-black via-[#000814] to-black pt-0 pb-5 relative z-40 overflow-hidden select-none">
      <div className="flex flex-col items-center">
        {/* TEXT ABOVE EARTH */}
        <AnimatePresence>
          {stage === 'idle' && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }} 
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 mb-2 z-10 pointer-events-none"
            >
              <h2 className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] text-white/80">
                Contact after transfer <span className="text-[#f7931a] drop-shadow-[0_0_8px_#f7931a]">BTC 0.00001</span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EARTH INTERACTION */}
        <div 
          className="relative w-[280px] md:w-[340px] h-[160px] md:h-[200px] flex items-center justify-center cursor-pointer overflow-visible"
          onClick={startZoom}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full h-full relative"
          >
            <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-700 ${stage === 'landed' ? 'opacity-0' : 'opacity-100'}`} />
            
            {/* SUBTLE GLOW */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {stage === 'idle' && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[9px] font-black text-cyan-400 tracking-[0.6em] uppercase"
                >
                  <MousePointer2 className="w-4 h-4 mx-auto mb-1 opacity-50" />
                  ACCESS
                </motion.div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {stage === 'landed' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d11347.16!2d94.678!3d28.418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDI1JzA0LjciTiA5NMKwNDAnNDIuNyJF!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&maptype=satellite"
              className="w-full flex-1 border-none brightness-90 saturate-[1.2]"
              title=" Kaying Village Area"
            />
            <div className="absolute top-6 right-6 z-30">
              <button onClick={reset} className="bg-black/60 backdrop-blur-md border border-white/20 p-3 rounded-full text-white hover:bg-red-500 transition-all"><ArrowLeft className="w-5 h-5" /></button>
            </div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-sm px-6">
              <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center shadow-2xl">
                <p className="text-[10px] text-cyan-400 font-black tracking-widest uppercase mb-1">Transmission Secured</p>
                <p className="text-xl font-black text-white mb-4">arunpangu81125@gmail.com</p>
                <button onClick={copyEmail} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-[10px] uppercase font-black tracking-widest">{isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {isCopied ? 'Copied' : 'Copy Email'}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
