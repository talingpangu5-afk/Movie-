'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ArrowLeft, Mail, Copy, Check, MousePointer2, Radio, Terminal, ExternalLink, Zap, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { SecretPlatform } from './SecretPlatform';

export function EarthZoomContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<'idle' | 'zooming' | 'landed' | 'secret' | 'deepSpace' | 'starFocus'>('idle');
  const stageRef = useRef(stage);

  // Cinematic timeline refs
  const cinematicTimer = useRef<NodeJS.Timeout | null>(null);
  const galaxyGroupRef = useRef<THREE.Group | null>(null);
  const targetStarRef = useRef<THREE.Mesh | null>(null);
  const warpLinesRef = useRef<THREE.Group | null>(null);
  const [marsAligned, setMarsAligned] = useState(false);
  const [showMarsUI, setShowMarsUI] = useState(false);
  const marsRef = useRef<THREE.Mesh | null>(null);
  const speedScale = useRef(1.0);
  const alignmentTimer = useRef<NodeJS.Timeout | null>(null);
  
  const audioCtx = useRef<AudioContext | null>(null);
  
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

  const playAlignmentSound = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 5);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 5);
    } catch (e) { console.error(e); }
  };

  const playWarpSound = () => {
    try {
      if (!audioCtx.current) return;
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.5);
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) { console.error(e); }
  };

  const triggerMarsAlignment = () => {
    setMarsAligned(true);
    setShowMarsUI(true);
    playAlignmentSound();

    // Cinematic pause: slow down time
    gsap.to(speedScale, {
      current: 0.1,
      duration: 1,
      ease: "power2.out"
    });

    if (marsRef.current) {
      gsap.to(marsRef.current.material as any, {
        emissiveIntensity: 5.0,
        duration: 1,
        repeat: 5,
        yoyo: true
      });
    }

    // Auto-reset after 5 seconds if not clicked
    alignmentTimer.current = setTimeout(() => {
      setMarsAligned(false);
      setShowMarsUI(false);
      gsap.to(speedScale, {
        current: 1.0,
        duration: 1.5,
        ease: "power2.in"
      });
    }, 5000);
  };

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

    let renderer: THREE.WebGLRenderer;
    try {
      if (!canvasRef.current) return;
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        precision: 'mediump',
      });
    } catch (e) {
      console.error('Failed to initialize WebGLRenderer:', e);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const loader = new THREE.TextureLoader();
    const earthTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
    const cloudTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-clouds.png');
    const nightTexture = loader.load('https://unpkg.com/three-globe/example/img/earth-night.jpg');

    // SUN (Central Hub)
    const sunGeo = new THREE.SphereGeometry(30, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ 
      color: 0xffcc33,
      transparent: true,
      opacity: 0.8
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    scene.add(sun);

    // Add Sun Glow
    const sunGlowGeo = new THREE.SphereGeometry(45, 32, 32);
    const sunGlowMat = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      uniforms: { glowColor: { value: new THREE.Color(0xffaa00) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize( normalMatrix * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow( 0.7 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 4.0 );
          gl_FragColor = vec4( glowColor, intensity );
        }
      `
    });
    scene.add(new THREE.Mesh(sunGlowGeo, sunGlowMat));

    // EARTH (Now an orbiting planet)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    const earthGeo = new THREE.SphereGeometry(15, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({ 
      map: earthTexture, 
      specular: new THREE.Color(0x333333),
      shininess: 15,
      bumpScale: 1
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earthGroup.add(earth);
    earthRef.current = earth;

    // CLOUDS
    const cloudGeo = new THREE.SphereGeometry(15.2, 64, 64);
    const cloudMat = new THREE.MeshPhongMaterial({ map: cloudTexture, transparent: true, opacity: 0.45 });
    const clouds = new THREE.Mesh(cloudGeo, cloudMat);
    earthGroup.add(clouds);
    cloudsRef.current = clouds;

    // ATMOSPHERE
    const atmosGeo = new THREE.SphereGeometry(17, 64, 64);
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
    earthGroup.add(atmosphere);

    // 8 SURROUNDING PLANETS
    const planets: THREE.Mesh[] = [];
    const planetData = [
      { name: 'Mercury', size: 6, color: 0x888888, dist: 50, speed: 0.005, offset: 0 },
      { name: 'Venus', size: 10, color: 0xffcc99, dist: 80, speed: 0.003, offset: 1.2 },
      { name: 'Mars', size: 8, color: 0xff6633, dist: 140, speed: 0.002, offset: 2.5, isMars: true },
      { name: 'Jupiter', size: 20, color: 0xeeb882, dist: 200, speed: 0.001, offset: 3.8 },
      { name: 'Saturn', size: 18, color: 0xe3d4a4, dist: 260, speed: 0.0008, offset: 4.5 },
      { name: 'Uranus', size: 12, color: 0xace5ee, dist: 320, speed: 0.0006, offset: 5.2 },
      { name: 'Neptune', size: 11, color: 0x4b70dd, dist: 380, speed: 0.0005, offset: 0.8 },
      { name: 'Pluto', size: 5, color: 0xcccccc, dist: 440, speed: 0.0004, offset: 2.0 },
    ];

    planetData.forEach((data, i) => {
      const geo = new THREE.SphereGeometry(data.size, 32, 32);
      const mat = new THREE.MeshPhongMaterial({ 
        color: data.color, 
        shininess: 10,
        emissive: data.isMars ? 0x330000 : 0x000000 
      });
      const planet = new THREE.Mesh(geo, mat);
      
      if (data.isMars) marsRef.current = planet;
      
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

    // GALAXY ASSETS (Hidden by default)
    const galaxyGroup = new THREE.Group();
    galaxyGroup.visible = false;
    scene.add(galaxyGroup);
    galaxyGroupRef.current = galaxyGroup;

    // Nebula Clouds (Billboards)
    const nebulaCount = 50;
    for (let i = 0; i < nebulaCount; i++) {
      const geo = new THREE.PlaneGeometry(1000, 1000);
      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x2244ff : 0xaa22ff,
        transparent: true,
        opacity: 0,
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0_bw.png'),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const nebula = new THREE.Mesh(geo, mat);
      nebula.position.set(
        (Math.random() - 0.5) * 5000,
        (Math.random() - 0.5) * 5000,
        -2000 - Math.random() * 5000
      );
      nebula.rotation.z = Math.random() * Math.PI;
      galaxyGroup.add(nebula);
    }

    // TARGET STAR
    const targetStarGeo = new THREE.SphereGeometry(15, 32, 32);
    const targetStarMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const targetStar = new THREE.Mesh(targetStarGeo, targetStarMat);
    targetStar.position.set(0, 0, -10000);
    galaxyGroup.add(targetStar);
    targetStarRef.current = targetStar;

    // Star Glow
    const starGlow = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { glowColor: { value: new THREE.Color(0x00ffff) } },
        vertexShader: sunGlowMat.vertexShader,
        fragmentShader: sunGlowMat.fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      })
    );
    targetStar.add(starGlow);

    // WARP LINES
    const warpLines = new THREE.Group();
    warpLines.visible = false;
    scene.add(warpLines);
    warpLinesRef.current = warpLines;

    const lineCount = 300;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    for (let i = 0; i < lineCount; i++) {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 50)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      line.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 500
      );
      warpLines.add(line);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 100, 100);
    scene.add(sunLight);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (stageRef.current === 'idle') {
        const delta = 0.016; // Approx 60fps
        
        // Move Earth
        const earthTime = Date.now() * 0.0005 * speedScale.current;
        earthGroup.position.x = Math.cos(earthTime) * 110;
        earthGroup.position.z = Math.sin(earthTime) * 110;

        if (earthRef.current) earthRef.current.rotation.y += 0.001 * speedScale.current;
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.0015 * speedScale.current;
        
        stars.rotation.y += 0.0002 * speedScale.current;

        planets.forEach((planet, idx) => {
          const data = planetData[idx];
          const time = Date.now() * data.speed * 0.1 * speedScale.current + data.offset;
          planet.position.x = Math.cos(time) * data.dist;
          planet.position.z = Math.sin(time) * data.dist;
          planet.rotation.y += 0.01 * speedScale.current;

          // Mars alignment detection
          if (data.isMars && speedScale.current > 0.3) {
            // Check if Mars is between camera and Earth
            const isNearCenter = Math.abs(planet.position.x) < 15;
            const isPositiveZ = planet.position.z > 40; // Closer to camera than Earth
            
            if (isNearCenter && isPositiveZ && !marsAligned) {
              triggerMarsAlignment();
            }
          }
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

    // Cinematic Auto-Trigger
    cinematicTimer.current = setTimeout(() => {
      if (stageRef.current === 'idle') {
        startGalaxyVoyage();
      }
    }, 10000);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      
      // Rigorous cleanup to prevent WebGL context loss
      if (sceneRef.current) {
        sceneRef.current.traverse((object: any) => {
          if (!object.isMesh) return;

          object.geometry.dispose();

          if (object.material.isMaterial) {
            cleanMaterial(object.material);
          } else {
            // Material is an array
            for (const material of object.material) cleanMaterial(material);
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
        rendererRef.current.domElement.remove();
        rendererRef.current = null;
      }
    };

    function cleanMaterial(material: any) {
      material.dispose();
      // Dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
          value.dispose();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startGalaxyVoyage = () => {
    if (stageRef.current !== 'idle') return;
    setStage('deepSpace');
    
    // Ambient sound trigger
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtx.current;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(40, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(42, ctx.currentTime);
      
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
      lfoGain.gain.setValueAtTime(10, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 5);
      
      lfo.connect(lfoGain.gain);
      lfoGain.connect(osc.frequency);
      lfoGain.connect(osc2.frequency);
      
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc2.start();
      lfo.start();
      
      // Stop ambient after transition
      setTimeout(() => {
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        setTimeout(() => { osc.stop(); osc2.stop(); lfo.stop(); }, 2000);
      }, 45000);
    } catch (e) { console.error(e); }

    const tl = gsap.timeline();
    
    // 1. Slow zoom out from Earth (10s)
    tl.to(cameraRef.current!.position, {
      z: 1500,
      duration: 10,
      ease: "power2.inOut",
      onStart: () => {
        // Stop Mars alignment during voyage
        setMarsAligned(true); 
      }
    });

    // 2. Galaxy transition (20s)
    tl.to(cameraRef.current!.position, {
      z: 5000,
      duration: 15,
      ease: "power1.in",
      onStart: () => {
        if (galaxyGroupRef.current) {
          galaxyGroupRef.current.visible = true;
          galaxyGroupRef.current.children.forEach(child => {
            if ((child as any).material) {
              gsap.to((child as any).material, { opacity: 0.3, duration: 5 });
            }
          });
        }
      }
    });

    // 3. Galactic sweep
    tl.to(cameraRef.current!.position, {
      x: 500,
      y: 300,
      z: 8000,
      duration: 10,
      ease: "none"
    }, "-=5");

    // 4. Focus Target Star
    tl.to(cameraRef.current!.position, {
      x: targetStarRef.current!.position.x,
      y: targetStarRef.current!.position.y,
      z: targetStarRef.current!.position.z + 300,
      duration: 5,
      ease: "power2.out",
      onComplete: () => {
        setStage('starFocus');
      }
    });

    // Fade up star opacity
    gsap.to(targetStarRef.current!.material as any, {
      opacity: 1,
      duration: 5,
      delay: 25
    });
  };

  const executeHyperspaceJump = () => {
    if (stage !== 'starFocus') return;
    setStage('zooming');
    playWarpSound();

    if (warpLinesRef.current) {
      warpLinesRef.current.visible = true;
      warpLinesRef.current.children.forEach(child => {
        if ((child as any).material) {
          gsap.to((child as any).material, { opacity: 1, duration: 0.2 });
        }
      });
    }

    const targetPos = targetStarRef.current!.position.clone();
    
    gsap.to(cameraRef.current!.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z - 50,
      duration: 2,
      ease: "power4.in",
      onUpdate: () => {
        // Vibration effect
        cameraRef.current!.position.x += (Math.random() - 0.5) * 2;
        cameraRef.current!.position.y += (Math.random() - 0.5) * 2;
      },
      onComplete: () => {
        setStage('secret');
        if (warpLinesRef.current) warpLinesRef.current.visible = false;
      }
    });

    // FOV distortion
    gsap.to(cameraRef.current!, {
      fov: 140,
      duration: 1.5,
      ease: "power2.in",
      onUpdate: () => cameraRef.current!.updateProjectionMatrix(),
      onComplete: () => {
        gsap.to(cameraRef.current!, { fov: 40, duration: 0.1, onUpdate: () => cameraRef.current!.updateProjectionMatrix() });
      }
    });
  };

  const enterSecretWorld = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alignmentTimer.current) clearTimeout(alignmentTimer.current);
    
    playWarpSound();
    setStage('zooming');
    
    // Smooth zoom into Mars
    const marsPos = marsRef.current?.position.clone() || new THREE.Vector3(0,0,0);
    
    gsap.to(cameraRef.current!.position, {
      x: marsPos.x,
      y: marsPos.y,
      z: marsPos.z + 10,
      duration: 1.5,
      ease: "power3.inOut",
      onComplete: () => {
        setStage('secret');
      }
    });

    // Fade out everything else
    if (sceneRef.current) {
      sceneRef.current.children.forEach(child => {
        if (child !== marsRef.current && (child as any).material) {
          gsap.to((child as any).material, { opacity: 0, duration: 1 });
        }
      });
    }
  };

  const startZoom = () => {
    if (stage !== 'idle') return;
    setStage('zooming');
    document.body.style.overflow = 'hidden';
    
    // Get earth's current position to target it
    const targetPos = earthRef.current!.parent!.position.clone();
    
    const tl = gsap.timeline({ onComplete: () => { setStage('landed'); document.body.style.overflow = 'auto'; } });
    tl.to(cameraRef.current!.position, { 
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z + 200, 
      duration: 0.6 
    });
    tl.to(earthRef.current!.rotation, { y: THREE.MathUtils.degToRad(-94.6), x: THREE.MathUtils.degToRad(28.4), duration: 2, ease: 'expo.inOut' }, "-=0.1");
    tl.to(cameraRef.current!.position, { 
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z + 40, 
      duration: 2.2, 
      ease: 'expo.inOut' 
    }, "<");
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
            <canvas ref={canvasRef} className={`w-full h-full transition-opacity duration-700 ${['landed', 'secret'].includes(stage) ? 'opacity-0' : 'opacity-100'}`} />
            
            {/* SUBTLE GLOW */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {stage === 'idle' && !showMarsUI && (
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

            {/* MARS UI OVERLAY */}
            <AnimatePresence>
              {showMarsUI && stage === 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-50"
                  onClick={enterSecretWorld}
                >
                  <div className="relative">
                    {/* Pulsing Hotspot */}
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-red-500/50"
                    />
                    
                    <div className="bg-black/60 backdrop-blur-md border border-red-500/30 p-4 rounded-lg text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                        <span className="text-[10px] font-black text-red-500 tracking-[0.2em] uppercase">Access Signal Detected</span>
                      </div>
                      <p className="text-white font-black text-xs tracking-widest uppercase mb-3 px-4 italic">Warning: Unknown Sector Ahead</p>
                      <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 bg-red-500/10 border border-red-500/50 text-[10px] font-black uppercase tracking-[0.3em] text-red-400 flex items-center justify-center gap-2 group"
                      >
                        <Terminal className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        Click to Enter
                      </motion.button>
                    </div>
                    
                    {/* Visual markers */}
                    <div className="absolute -top-10 -left-10 w-20 h-[1px] bg-red-500/30 rotate-45" />
                    <div className="absolute -bottom-10 -right-10 w-20 h-[1px] bg-red-500/30 rotate-45" />
                  </div>
                </motion.div>
              )}

              {stage === 'starFocus' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-50 px-6"
                  onClick={(e) => { e.stopPropagation(); executeHyperspaceJump(); }}
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative group cursor-pointer"
                  >
                    {/* Outer Rings */}
                    {[1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.2 + i * 0.2, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                        className="absolute inset-x-0 inset-y-0 rounded-full border border-cyan-400/30"
                        style={{ margin: -i * 20 }}
                      />
                    ))}

                    <div className="bg-black/40 backdrop-blur-2xl border border-cyan-400/40 p-8 rounded-[2rem] text-center shadow-[0_0_50px_rgba(34,211,238,0.2)] hover:border-cyan-400 transition-all duration-500">
                      <div className="flex flex-col items-center gap-4 mb-4">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        >
                           <Zap className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-black text-white tracking-widest uppercase mb-1">Enter the Unknown</h3>
                          <p className="text-cyan-400/60 text-[10px] font-black uppercase tracking-[0.4em]">Sector Identified: X-88</p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05, letterSpacing: "0.6em" }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-4 bg-cyan-400/10 border border-cyan-400/50 text-xs font-black uppercase tracking-[0.4em] text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all group overflow-hidden relative"
                      >
                        <span className="relative z-10">Warp Now</span>
                        <motion.div 
                          className="absolute inset-0 bg-cyan-400"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "0%" }}
                        />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {stage === 'secret' && (
          <SecretPlatform onExit={() => {
            setStage('idle');
            setMarsAligned(false);
            setShowMarsUI(false);
            speedScale.current = 1.0;
            // Restore visibility
            if (sceneRef.current) {
              sceneRef.current.children.forEach(child => {
                if ((child as any).material) {
                  gsap.to((child as any).material, { opacity: 1, duration: 1 });
                }
              });
            }
            if (cameraRef.current) cameraRef.current.position.z = 160;
          }} />
        )}

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
