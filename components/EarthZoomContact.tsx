'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ArrowLeft, Mail, Copy, Check, MousePointer2, Globe } from 'lucide-react';
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

  const [webglError, setWebglError] = useState(false);

  // Three.js refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthRef = useRef<THREE.Mesh | null>(null);
  const cloudsRef = useRef<THREE.Mesh | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const resourcesRef = useRef<{
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  }>({
    geometries: [],
    materials: [],
    textures: []
  });

  useEffect(() => {
    // Return early if WebGL is known to be unavailable
    if (webglError) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: THREE.WebGLRenderer | null = null;
    const resources = resourcesRef.current;
    
    try {
      // SCENE SETUP
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const aspect = width / height;

      const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
      camera.position.z = 160;
      cameraRef.current = camera;

      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        precision: 'mediump',
        powerPreference: 'low-power', // Prefer stability over max performance
      });
      
      const gl = renderer.getContext();
      if (!gl) {
        throw new Error('WebGL context could not be acquired');
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      rendererRef.current = renderer;

      const onContextLost = (event: Event) => {
        event.preventDefault();
        console.warn('WebGL Context Lost');
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        setWebglError(true);
      };

      const onContextRestored = () => {
        console.log('WebGL Context Restored');
        setWebglError(false);
        // Do not reload window if possible, but let the effect restart
      };

      canvas.addEventListener('webglcontextlost', onContextLost, false);
      canvas.addEventListener('webglcontextrestored', onContextRestored, false);

      const loader = new THREE.TextureLoader();
      const loadTexture = (url: string) => {
        const tex = loader.load(url);
        resources.textures.push(tex);
        return tex;
      };

      const earthTexture = loadTexture('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
      const cloudTexture = loadTexture('https://unpkg.com/three-globe/example/img/earth-clouds.png');

      // EARTH - Reduced segments for better stability
      const earthGeo = new THREE.SphereGeometry(60, 48, 48);
      resources.geometries.push(earthGeo);
      const earthMat = new THREE.MeshPhongMaterial({ map: earthTexture, shininess: 5 });
      resources.materials.push(earthMat);
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);
      earthRef.current = earth;

      // CLOUDS - Reduced segments
      const cloudGeo = new THREE.SphereGeometry(60.5, 48, 48);
      resources.geometries.push(cloudGeo);
      const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true, opacity: 0.3 });
      resources.materials.push(cloudMat);
      const clouds = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(clouds);
      cloudsRef.current = clouds;

      // GLOW - Reduced segments
      const glowGeo = new THREE.SphereGeometry(62, 48, 48);
      resources.geometries.push(glowGeo);
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { glowColor: { value: new THREE.Color(0x00f2ff) } },
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
            float intensity = pow( 0.6 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
            gl_FragColor = vec4( glowColor, intensity );
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      resources.materials.push(glowMat);
      scene.add(new THREE.Mesh(glowGeo, glowMat));

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);
      const sunLight = new THREE.DirectionalLight(0xffffff, 1);
      sunLight.position.set(100, 100, 100);
      scene.add(sunLight);

      const animate = () => {
        frameIdRef.current = requestAnimationFrame(animate);
        if (earthRef.current && cloudsRef.current && stageRef.current === 'idle') {
          earthRef.current.rotation.y += 0.001;
          cloudsRef.current.rotation.y += 0.0015;
        }
        if (renderer) {
          renderer.render(scene, camera);
        }
      };
      animate();

      const handleResize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer?.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        
        resources.geometries.forEach(g => g.dispose());
        resources.materials.forEach(m => m.dispose());
        resources.textures.forEach(t => t.dispose());
        
        if (renderer) {
          renderer.dispose();
        }

        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);
      };
    } catch (e) {
      console.error('Failed to initialize WebGL:', e);
      setWebglError(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            className="w-full h-full relative flex items-center justify-center"
          >
            {webglError ? (
              <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 rounded-full border border-white/10 aspect-square">
                <Globe className="w-12 h-12 text-cyan-500/50 mb-2" />
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest text-center">Interactive Globe<br/>Unavailable</span>
              </div>
            ) : (
              <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-700 ${stage === 'landed' ? 'opacity-0' : 'opacity-100'}`} />
            )}
            
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
