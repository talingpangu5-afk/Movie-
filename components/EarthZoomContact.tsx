'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ArrowLeft, Mail, Copy, Check, MousePointer2, Radio, Terminal, ExternalLink, Zap, ShieldCheck, Droplets, LandPlot, Building2, Activity, Cpu, Globe, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { SecretPlatform } from './SecretPlatform';
import { SunHubPlatform } from './SunHubPlatform';

export function EarthZoomContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<'idle' | 'zooming' | 'landed' | 'secret' | 'deepSpace' | 'starFocus' | 'sunHub'>('idle');
  const [isSatellite, setIsSatellite] = useState(false);
  const stageRef = useRef(stage);

  // Cinematic timeline refs
  const sunSoundRef = useRef<AudioBufferSourceNode | null>(null);
  const cinematicTimer = useRef<NodeJS.Timeout | null>(null);
  const galaxyGroupRef = useRef<THREE.Group | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);
  const targetStarRef = useRef<THREE.Mesh | null>(null);
  const warpLinesRef = useRef<THREE.Group | null>(null);
  const [marsAligned, setMarsAligned] = useState(false);
  const [showMarsUI, setShowMarsUI] = useState(false);
  const marsRef = useRef<THREE.Mesh | null>(null);
  const speedScale = useRef(1.0);
  const alignmentTimer = useRef<NodeJS.Timeout | null>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  
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
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);

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

    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50000);
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
    textureLoaderRef.current = loader;
    const earthTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const satelliteTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');
    const cloudTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_2048.png');
    const nightTexture = loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');

    // SUN (Realistic Boiling Surface Shader)
    const sunGeo = new THREE.SphereGeometry(30, 64, 64);
    const sunMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xffaa00) },
        color2: { value: new THREE.Color(0xff4400) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec2 vUv;
        varying vec3 vNormal;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        void main() {
          float n = hash(vUv * 10.0 + time * 0.1);
          vec3 color = mix(color1, color2, n * 0.5 + 0.5);
          float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(color + intensity * 0.4, 1.0);
        }
      `
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.userData = { name: 'Sun' };
    scene.add(sun);

    // Add Sun Glow
    const sunGlowGeo = new THREE.SphereGeometry(45, 64, 64);
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
      shininess: 25,
      bumpScale: 0.05,
      bumpMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_bump_2048.jpg')
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.userData = { name: 'Earth' };
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
      { name: 'Mercury', size: 6, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mercury_1024.jpg', dist: 50, speed: 0.005, offset: 0 },
      { name: 'Venus', size: 10, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/venus_surface.jpg', dist: 80, speed: 0.003, offset: 1.2 },
      { 
        name: 'Mars', 
        size: 8, 
        texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_color.jpg', 
        bump: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars_1k_topo.jpg',
        dist: 140, 
        speed: 0.002, 
        offset: 2.5, 
        isMars: true 
      },
      { name: 'Jupiter', size: 20, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg', dist: 200, speed: 0.001, offset: 3.8 },
      { name: 'Saturn', size: 18, texture: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/saturn_1k_color.jpg', dist: 260, speed: 0.0008, offset: 4.5 },
      { name: 'Uranus', size: 12, color: 0xace5ee, dist: 320, speed: 0.0006, offset: 5.2 },
      { name: 'Neptune', size: 11, color: 0x4b70dd, dist: 380, speed: 0.0005, offset: 0.8 },
      { name: 'Pluto', size: 5, color: 0xcccccc, dist: 440, speed: 0.0004, offset: 2.0 },
    ];

    planetData.forEach((data, i) => {
      const geo = new THREE.SphereGeometry(data.size, 64, 64);
      let mat;
      if (data.texture) {
        mat = new THREE.MeshPhongMaterial({ 
          map: loader.load(data.texture), 
          shininess: data.isMars ? 5 : 10,
          specular: data.isMars ? new THREE.Color(0x332211) : new THREE.Color(0x111111),
          bumpMap: data.bump ? loader.load(data.bump) : null,
          bumpScale: data.isMars ? 0.05 : 0
        });
      } else {
        mat = new THREE.MeshPhongMaterial({ 
          color: (data as any).color, 
          shininess: 10,
          emissive: data.isMars ? 0x220500 : 0x000000 
        });
      }
      
      const planet = new THREE.Mesh(geo, mat);
      planet.userData = { name: data.name };
      
      if (data.isMars) marsRef.current = planet;

      if (data.name === 'Saturn') {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);
        const ringMat = new THREE.MeshBasicMaterial({ 
          color: 0x887766, 
          side: THREE.DoubleSide, 
          transparent: true, 
          opacity: 0.6 
        });
        const rings = new THREE.Mesh(ringGeo, ringMat);
        rings.rotation.x = Math.PI / 2.5;
        planet.add(rings);
      }

      // Add a subtle atmosphere to each planet for NASA feel
      const planetAtmosGeo = new THREE.SphereGeometry(data.size * 1.05, 32, 32);
      const planetAtmosMat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        uniforms: {
          glowColor: { value: new THREE.Color(data.name === 'Mars' ? 0xe27b58 : 0x88ccff) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 glowColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.6 - dot(vNormal, vec3(0,0,1.0)), 4.0);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `
      });
      planet.add(new THREE.Mesh(planetAtmosGeo, planetAtmosMat));
      
      // Initial position
      const angle = data.offset;
      planet.position.set(Math.cos(angle) * data.dist, (Math.random() - 0.5) * 50, Math.sin(angle) * data.dist);
      
      scene.add(planet);
      planets.push(planet);
    });

    // STARFIELD (Initial)
    const starGeo = new THREE.BufferGeometry();
    const starCount = 3000;
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i<starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 4000;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMat = new THREE.PointsMaterial({ size: 1.5, color: 0xffffff, transparent: true, opacity: 0.8 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    starsRef.current = stars;

    // MILKY WAY DISC (Large point cloud with spiral structure)
    const galaxyDiscGeo = new THREE.BufferGeometry();
    const galaxyDiscCount = 50000;
    const galaxyDiscPos = new Float32Array(galaxyDiscCount * 3);
    const galaxyDiscColors = new Float32Array(galaxyDiscCount * 3);
    
    for (let i = 0; i < galaxyDiscCount; i++) {
      // Bulge vs Arms
      const isBulge = Math.random() > 0.8;
      let radius, angle, x, y, z;
      
      if (isBulge) {
        radius = Math.random() * 800;
        angle = Math.random() * Math.PI * 2;
        x = Math.cos(angle) * radius;
        y = (Math.random() - 0.5) * radius * 0.8;
        z = Math.sin(angle) * radius;
      } else {
        // Spiral Arms
        const armIndex = i % 4;
        radius = 1000 + Math.random() * 10000;
        angle = (radius / 2000) * 1.5 + (armIndex * (Math.PI / 2)) + (Math.random() - 0.5) * 0.5;
        x = Math.cos(angle) * radius;
        y = (Math.random() - 0.5) * 400 * (1 - radius / 10000);
        z = Math.sin(angle) * radius;
      }

      // Offset far into deep space
      z -= 20000;
      
      galaxyDiscPos[i * 3] = x;
      galaxyDiscPos[i * 3 + 1] = y;
      galaxyDiscPos[i * 3 + 2] = z;

      const innerColor = new THREE.Color(0xffaa88);
      const outerColor = new THREE.Color(0x88ccff);
      const mixedColor = innerColor.clone().lerp(outerColor, radius / 10000);
      
      galaxyDiscColors[i * 3] = mixedColor.r;
      galaxyDiscColors[i * 3 + 1] = mixedColor.g;
      galaxyDiscColors[i * 3 + 2] = mixedColor.b;
    }
    
    galaxyDiscGeo.setAttribute('position', new THREE.BufferAttribute(galaxyDiscPos, 3));
    galaxyDiscGeo.setAttribute('color', new THREE.BufferAttribute(galaxyDiscColors, 3));
    
    const galaxyDiscMat = new THREE.PointsMaterial({ 
      size: 4, 
      vertexColors: true, 
      transparent: true, 
      opacity: 0,
      blending: THREE.AdditiveBlending 
    });
    
    const galaxyDisc = new THREE.Points(galaxyDiscGeo, galaxyDiscMat);
    
    galaxyGroupRef.current = new THREE.Group();
    galaxyGroupRef.current.add(galaxyDisc);
    galaxyGroupRef.current.visible = false;
    scene.add(galaxyGroupRef.current);

    // TARGET STAR - Multi-layered for realistic glow
    const targetStarContainer = new THREE.Group();
    targetStarContainer.position.set(0, 0, -25000);
    galaxyGroupRef.current.add(targetStarContainer);

    const targetStarGeo = new THREE.SphereGeometry(30, 64, 64);
    const targetStarMat = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    const targetStar = new THREE.Mesh(targetStarGeo, targetStarMat);
    targetStarContainer.add(targetStar);
    targetStarRef.current = targetStar;

    // Intense Glow Layers
    const glowColors = [0x00ffff, 0x0088ff, 0x0044ff];
    glowColors.forEach((color, i) => {
      const glowGeo = new THREE.SphereGeometry(40 + i * 20, 32, 32);
      const glowMat = new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(color) } },
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
            float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), ${3.0 + i}.0 );
            gl_FragColor = vec4( glowColor, intensity );
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      targetStar.add(new THREE.Mesh(glowGeo, glowMat));
    });

    // MILKY WAY NEBULAE (Concentrated in the disc)
    for (let i = 0; i < 40; i++) {
        const size = 3000 + Math.random() * 2000;
        const nebGeo = new THREE.PlaneGeometry(size, size);
        const nebMat = new THREE.MeshBasicMaterial({
            color: i % 2 === 0 ? 0x2244ff : 0xaa22ff,
            transparent: true,
            opacity: 0,
            map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/lensflare/lensflare0_bw.png'),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        const nebula = new THREE.Mesh(nebGeo, nebMat);
        const angle = Math.random() * Math.PI * 2;
        const radius = 5000 + Math.random() * 5000;
        nebula.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 1000,
            Math.sin(angle) * radius - 15000
        );
        nebula.rotation.z = Math.random() * Math.PI;
        galaxyGroupRef.current.add(nebula);
    }

    // WARP LINES
    const warpLines = new THREE.Group();
    warpLines.visible = false;
    scene.add(warpLines);
    warpLinesRef.current = warpLines;

    const lineCount = 800;
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0 });
    for (let i = 0; i < lineCount; i++) {
      const length = 50 + Math.random() * 200;
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, length)
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      const radius = 50 + Math.random() * 400;
      const angle = Math.random() * Math.PI * 2;
      line.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.random() - 0.5) * 5000
      );
      warpLines.add(line);
    }

    // Asteroid Belt (Between Mars and Jupiter)
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);
    const asteroidCount = 1000;
    const asteroidGeo = new THREE.IcosahedronGeometry(0.5, 0);
    const asteroidMat = new THREE.MeshPhongMaterial({ color: 0x888888 });
    for (let i = 0; i < asteroidCount; i++) {
        const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
        const radius = 160 + Math.random() * 30;
        const angle = Math.random() * Math.PI * 2;
        asteroid.position.set(
            Math.cos(angle) * radius,
            (Math.random() - 0.5) * 10,
            Math.sin(angle) * radius
        );
        asteroid.rotation.set(Math.random(), Math.random(), Math.random());
        asteroidGroup.add(asteroid);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
    sunLight.position.set(100, 100, 100);
    scene.add(sunLight);

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      const currentTime = Date.now();
      const delta = currentTime * 0.001;

      // Update Sun Shader
      if (sunMat.uniforms.time) {
        sunMat.uniforms.time.value = delta;
      }

      if (stageRef.current === 'idle') {
        const earthTime = currentTime * 0.00025 * speedScale.current;
        earthGroup.position.x = Math.cos(earthTime) * 110;
        earthGroup.position.z = Math.sin(earthTime) * 110;

        if (earthRef.current) earthRef.current.rotation.y += 0.002 * speedScale.current;
        if (cloudsRef.current) cloudsRef.current.rotation.y += 0.003 * speedScale.current;
        
        stars.rotation.y += 0.0001 * speedScale.current;

        planets.forEach((planet, idx) => {
          const data = planetData[idx];
          const time = currentTime * data.speed * 0.1 * speedScale.current + data.offset;
          planet.position.x = Math.cos(time) * data.dist;
          planet.position.z = Math.sin(time) * data.dist;
          planet.rotation.y += 0.005 * speedScale.current;
        });

        // Rotate Asteroid Belt
        asteroidGroup.rotation.y += 0.0003 * speedScale.current;
      }

      // GALAXY ANIMATION (Active during voyage)
      if (galaxyGroupRef.current && (stageRef.current === 'deepSpace' || stageRef.current === 'starFocus' || stageRef.current === 'zooming')) {
        galaxyGroupRef.current.rotation.y += 0.0001;
        galaxyGroupRef.current.children.forEach((child: any) => {
          if (child.isMesh && child.geometry && child.geometry.type === 'PlaneGeometry') {
            child.rotation.z += 0.00005;
            // Pulsing nebula intensity
            if (child.material && child.material.opacity > 0) {
              child.material.opacity = 0.4 + Math.sin(currentTime * 0.0005 + child.position.x * 0.01) * 0.2;
            }
          }
        });
      }

      // CAMERA SWAY FOR REALISM
      if (cameraRef.current && (stageRef.current === 'idle' || stageRef.current === 'deepSpace' || stageRef.current === 'starFocus')) {
        const swayX = Math.sin(currentTime * 0.0005) * 1.5;
        const swayY = Math.cos(currentTime * 0.0007) * 1.5;
        cameraRef.current.position.x += (swayX * 0.1 - cameraRef.current.position.x) * 0.01;
        cameraRef.current.position.y += (swayY * 0.1 - cameraRef.current.position.y) * 0.01;
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

    const handlePlanetClick = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !cameraRef.current || !sceneRef.current) return;

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        let p = clickedObj;
        while (p.parent && !p.userData.name) p = p.parent;
        
        const name = p.userData.name;
        
        if (name === 'Earth') {
          startZoom();
        } else if (name === 'Mars') {
          enterSecretWorld(event as any);
        } else if (name === 'Sun') {
          enterSunHub();
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect || !cameraRef.current || !sceneRef.current) return;

      mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, cameraRef.current);
      const intersects = raycaster.current.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.name) obj = obj.parent;
        
        const name = obj.userData.name;
        if (name === 'Earth' || name === 'Mars' || name === 'Sun') {
          canvasRef.current!.style.cursor = 'pointer';
          return;
        }
      }
      if (canvasRef.current) canvasRef.current.style.cursor = 'default';
    };

    const currentCanvas = canvasRef.current;
    if (currentCanvas) {
      currentCanvas.addEventListener('click', handlePlanetClick);
      currentCanvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentCanvas) {
        currentCanvas.removeEventListener('click', handlePlanetClick);
        currentCanvas.removeEventListener('mousemove', handleMouseMove);
      }
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

  const enterSunHub = () => {
    if (stageRef.current !== 'idle') return;
    setStage('sunHub');
    
    if (cinematicTimer.current) clearTimeout(cinematicTimer.current);

    gsap.to(cameraRef.current!.position, {
      x: 0,
      y: 10,
      z: 100,
      duration: 2.5,
      ease: "power3.inOut"
    });

    gsap.to(cameraRef.current!, {
      fov: 60,
      duration: 2.5,
      onUpdate: () => cameraRef.current!.updateProjectionMatrix()
    });

    playSunProximitySound();
  };

  const playSunProximitySound = () => {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtx.current;
      
      const osc = ctx.createOscillator();
      const noise = ctx.createBufferSource();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;
      noise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(200, ctx.currentTime);
      filter.Q.value = 10;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
      sunSoundRef.current = noise;
    } catch (e) { console.error(e); }
  };

  const exitSunHub = () => {
    setStage('idle');
    if (sunSoundRef.current) {
      sunSoundRef.current.stop();
      sunSoundRef.current = null;
    }

    gsap.to(cameraRef.current!.position, {
      z: 160,
      duration: 2,
      ease: "power2.out"
    });

    gsap.to(cameraRef.current!, {
      fov: 40,
      duration: 2,
      onUpdate: () => cameraRef.current!.updateProjectionMatrix()
    });
  };

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
    
    // 1. Slow zoom out from Earth (10s), passing through the system
    tl.to(cameraRef.current!.position, {
      x: 300,
      y: 100,
      z: 2000,
      duration: 12,
      ease: "power2.inOut",
      onStart: () => {
        // Stop Mars alignment during voyage
        setMarsAligned(true); 
      },
      onUpdate: () => {
        if (cameraRef.current) cameraRef.current.lookAt(0, 0, 0); // Keep looking at Sun/Center during local exit
      }
    });

    // 2. Galaxy transition (15s) - Tilt and dive into deep space
    tl.to(cameraRef.current!.position, {
      x: 2000,
      y: 1000,
      z: 15000,
      duration: 15,
      ease: "power2.in",
      onStart: () => {
        if (galaxyGroupRef.current) {
          galaxyGroupRef.current.visible = true;
          galaxyGroupRef.current.children.forEach(child => {
            if ((child as any).material) {
              gsap.to((child as any).material, { opacity: 0.9, duration: 8 });
            }
          });
        }
        if (starsRef.current) {
          gsap.to(starsRef.current.material, { opacity: 0, duration: 6 });
        }
      }
    });

    // 3. Focus Target Star (Wait/Glide)
    const targetWorldPos = new THREE.Vector3(0, 0, -25000); 
    if (targetStarRef.current) {
      targetStarRef.current.position.set(0, 0, -25000);
      gsap.to((targetStarRef.current.material as any), { opacity: 1, duration: 10, delay: 10 });
    }

    tl.to(cameraRef.current!.position, {
      x: targetWorldPos.x,
      y: targetWorldPos.y,
      z: targetWorldPos.z + 800,
      duration: 15,
      ease: "power3.out",
      onComplete: () => {
        setStage('starFocus');
      }
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

      // Stretch warp lines for motion blur feel
      gsap.to(warpLinesRef.current.scale, {
        z: 10,
        duration: 1.5,
        ease: "power2.in"
      });
    }

    if (!targetStarRef.current || !cameraRef.current) return;
    const targetPos = targetStarRef.current.position.clone();
    
    gsap.to(cameraRef.current.position, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z - 400,
      duration: 2.5,
      ease: "power4.in",
      onUpdate: () => {
        if (cameraRef.current) {
          // Intensive Vibration effect
          cameraRef.current.position.x += (Math.random() - 0.5) * 5;
          cameraRef.current.position.y += (Math.random() - 0.5) * 5;
        }
      },
      onComplete: () => {
        setStage('secret');
        if (warpLinesRef.current) warpLinesRef.current.visible = false;
      }
    });

    // FOV distortion
    if (cameraRef.current) {
      const camera = cameraRef.current;
      gsap.to(camera, {
        fov: 140,
        duration: 1.5,
        ease: "power2.in",
        onUpdate: () => camera.updateProjectionMatrix(),
        onComplete: () => {
          gsap.to(camera, { 
            fov: 40, 
            duration: 0.1, 
            onUpdate: () => camera.updateProjectionMatrix() 
          });
        }
      });
    }
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
    
    // Switch to satellite view mid-zoom
    tl.to({}, { 
      duration: 0.3, 
      onComplete: () => {
        setIsSatellite(true);
        if (earthRef.current && textureLoaderRef.current) {
          (earthRef.current.material as THREE.MeshPhongMaterial).map = textureLoaderRef.current.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png');
          (earthRef.current.material as THREE.MeshPhongMaterial).needsUpdate = true;
        }
      }
    });

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
    setIsSatellite(false);
    if (cameraRef.current) cameraRef.current.position.z = 160;
    if (earthRef.current && textureLoaderRef.current) {
      (earthRef.current.material as THREE.MeshPhongMaterial).map = textureLoaderRef.current.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
      (earthRef.current.material as THREE.MeshPhongMaterial).needsUpdate = true;
    }
    if (sunSoundRef.current) {
      sunSoundRef.current.stop();
      sunSoundRef.current = null;
    }
  };

  const locationAssets = [
    {
      title: "Bio-Synthetic Jungle",
      label: "BIO_SYNAPSE_NODE_01",
      src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
      stats: { primary: "Biomass: 94.8%", secondary: "O2_Uptake: 21.8%", tertiary: "Flora: Optimizing" },
      geo: { lat: "28.41N", lng: "94.67E", sector: "Alpha-7" },
      details: ["Thermal signature: Organic", "Genetic drift: 0.04%", "Humidity: 94.2%"]
    },
    {
      title: "Hydro Basal Matrix",
      label: "AQUA_FLOW_ARCHIVE_02",
      src: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80",
      stats: { primary: "H2O_Purity: 99.1%", secondary: "Depth: 1.4km", tertiary: "Currents: Static" },
      geo: { lat: "12.55S", lng: "45.12W", sector: "Beta-3" },
      details: ["Salinity: 0.12%", "Ion Charge: Negative", "Pressure: 140 bar"]
    },
    {
      title: "Arid Strata Ground",
      label: "GEO_CORE_SCAN_03",
      src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&q=80",
      stats: { primary: "Density: 5.2t/m³", secondary: "Quartz: 14.5%", tertiary: "Stability: 1.0" },
      geo: { lat: "45.22N", lng: "12.88E", sector: "Gamma-9" },
      details: ["Vibration: 0.02Hz", "Core Temp: 452C", "Density: 5.51g/cm³"]
    },
    {
      title: "Atmos Vapor Cell",
      label: "ATMOS_VAPOR_LOG_04",
      src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      stats: { primary: "Humidity: 84.1%", secondary: "Pressure: 1013hPa", tertiary: "Wind: 14km/h" },
      geo: { lat: "0.00N", lng: "180.00W", sector: "Delta-1" },
      details: ["N2 Content: 78%", "O2 Level: 21%", "Visibility: 99%"]
    },
    {
      title: "Thermal Ridge Node",
      label: "MAGMA_CORE_SCAN_05",
      src: "https://images.unsplash.com/photo-1516339901600-2e1a62986307?w=800&q=80",
      stats: { primary: "Temp: 1450°C", secondary: "Sulfur: 4.8%", tertiary: "Eruption: 0.01%" },
      geo: { lat: "19.43N", lng: "155.51W", sector: "Epsilon-5" },
      details: ["Lava Flow: Active", "Seismic: Level 2", "Gas Leak: Min"]
    }
  ];

  return (
    <div className="w-full bg-transparent pt-0 pb-5 relative z-40 overflow-hidden select-none">
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
            className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-y-auto no-scrollbar"
          >
            {/* Satellite View Header */}
            <div className="relative h-[60vh] w-full overflow-hidden shrink-0">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d11347.16!2d94.678!3d28.418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjjCsDI1JzA0LjciTiA5NMKwNDAnNDIuNyJF!5e1!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin&maptype=satellite"
                className="w-full h-full border-none brightness-75 contrast-125 saturate-[1.5]"
                title="Satellite Feed"
                />
                
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,182,212,0.1)_100%)] mix-blend-overlay" />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
                    
                    {/* Scanning Bar */}
                    <motion.div 
                      animate={{ y: ["0%", "100%", "0%"] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.3)] z-20"
                    />

                    <div className="absolute top-10 left-10 text-cyan-400 font-mono text-[10px] space-y-2 z-30">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span>SATELLITE_UPLINK: ACTIVE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-3 h-3 animate-spin duration-[3000ms]" />
                            <span>SYNC_RATE: 48.2 Gbps</span>
                        </div>
                        <div className="border-l border-cyan-500/30 pl-3 py-1 space-y-1">
                            <div>COORD: 28&deg;25&apos;04.7&quot;N 94&deg;40&apos;42.7&quot;E</div>
                            <div>ALTITUDE: 15,400 KM</div>
                            <div>RESOLUTION: 0.2m/PX</div>
                            <div className="text-[8px] text-cyan-400/60 mt-1 animate-pulse">UPLINK_ID: arunpangu81125@gmail.com</div>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <div className="w-1 h-1 bg-cyan-400" />
                            <div className="w-1 h-1 bg-cyan-400/50" />
                            <div className="w-1 h-1 bg-cyan-400/20" />
                        </div>
                    </div>
                    
                    <div className="absolute bottom-10 right-10 text-cyan-500/50 font-mono text-[8px] uppercase tracking-widest text-right z-30">
                        <div className="flex flex-col gap-1">
                            <span>NEURAL_STREAM v8.0_ALPHA</span>
                            <span>ENCRYPTION: QUANTUM_ECC</span>
                            <span className="text-cyan-400/80 animate-pulse">TRANSMITTING...</span>
                        </div>
                    </div>
                </div>

                <div className="absolute top-6 right-6 z-30">
                    <button onClick={reset} className="bg-black/60 backdrop-blur-xl border border-cyan-500/30 p-4 rounded-2xl text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Geo-tagging 3D Gallery */}
            <div className="container mx-auto px-6 py-20 relative z-10">
                <div className="mb-12 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
                    >
                        Geo-Tagged Assets Retrieved
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Location <span className="text-cyan-400">Archives</span>
                    </h2>
                                        <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">Decrypted data from Kaying Sector 4.2</p>
                </div>

                {/* PROMINENT AD PLACEMENT - TOP */}
                <div className="mb-20">
                    <div className="relative group cursor-pointer h-24 border border-cyan-500/30 rounded-2xl bg-black/40 overflow-hidden backdrop-blur-xl transition-all hover:border-cyan-400">
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(6,182,212,0.1),transparent)] group-hover:animate-pulse" />
                        <div className="absolute inset-x-0 h-[1px] bg-cyan-400/50 top-1/2 -translate-y-1/2 opacity-20" />
                        <div className="absolute inset-0 flex items-center justify-between px-12">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                    <Globe className="w-6 h-6 text-cyan-400 animate-pulse" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-[0.2em] mb-1">Global Node Ad-Uplink</div>
                                    <div className="text-white font-black uppercase tracking-widest text-sm">Strategic Partner Deployment 042</div>
                                </div>
                            </div>
                            <div className="hidden md:flex items-center gap-8 text-[11px] font-mono text-cyan-400/40 uppercase">
                                <div className="flex flex-col">
                                    <span>Latency: 4ms</span>
                                    <span>Bandwidth: Unlimited</span>
                                </div>
                                <div className="h-10 w-px bg-cyan-500/20" />
                                <div className="flex flex-col">
                                    <span>Priority: High</span>
                                    <span>Status: Synchronized</span>
                                </div>
                            </div>
                            <button className="px-6 py-2 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-lg hover:bg-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                Connect Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Futuristc Location Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
                    {[
                        { icon: Droplets, label: "H2O_ANALYSIS", value: "98.4%", color: "text-blue-400", sub: "Purity Index" },
                        { icon: LandPlot, label: "GEO_COMPOSITION", value: "STABLE", color: "text-green-400", sub: "Mineral density high" },
                        { icon: Building2, label: "STRUCTURAL_SYNC", value: "ACTIVE", color: "text-purple-400", sub: "14 Nodes Detected" },
                        { icon: Activity, label: "NEURAL_FLUX", value: "OPTIMAL", color: "text-cyan-400", sub: "Syncing..." }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-3xl group hover:border-cyan-400/30 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div className="text-[10px] font-mono text-gray-500 tracking-tighter">0xDBF_{i}</div>
                            </div>
                            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
                            <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                            <div className="text-[10px] font-mono text-white/20 uppercase">{stat.sub}</div>
                            
                            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "70%" }}
                                    transition={{ duration: 1.5, delay: i * 0.2 }}
                                    className={`h-full bg-current ${stat.color}`} 
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {locationAssets.map((asset, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ y: 50, opacity: 0, rotateY: 20 }}
                            whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
                            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ 
                              scale: 1.05, 
                              z: 50,
                              rotateY: 5,
                              boxShadow: "0 25px 50px -12px rgba(6,182,212,0.5)"
                            }}
                            className="relative aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer border border-cyan-500/20 bg-black/40 backdrop-blur-xl preserve-3d"
                        >
                            {/* Depth Effect Layers */}
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                            
                            <Image 
                                src={asset.src} 
                                alt={asset.title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
                                referrerPolicy="no-referrer"
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            
                            <div className="absolute bottom-6 left-6 right-6 z-10">
                                <div className="text-[9px] font-mono text-cyan-400 mb-1 tracking-widest flex items-center gap-2">
                                    <Cpu className="w-3 h-3" />
                                    {asset.label}
                                </div>
                                <div className="text-xl font-black text-white uppercase tracking-tighter group-hover:text-cyan-400 transition-colors mb-2">{asset.title}</div>
                                
                                <div className="grid grid-cols-1 gap-1 border-t border-white/10 pt-3">
                                    <div className="flex justify-between items-center text-[7px] font-mono text-cyan-400/40 mb-1">
                                        <span>LOC: {(asset as any).geo.lat} {(asset as any).geo.lng}</span>
                                        <span>SEC: {(asset as any).geo.sector}</span>
                                    </div>
                                    <div className="text-[8px] font-mono text-gray-500 flex justify-between">
                                        <span>PRIMARY:</span>
                                        <span className="text-cyan-400">{asset.stats.primary}</span>
                                    </div>
                                    <div className="text-[8px] font-mono text-gray-500 flex justify-between">
                                        <span>SECONDARY:</span>
                                        <span className="text-cyan-400">{asset.stats.secondary}</span>
                                    </div>
                                    <div className="text-[8px] font-mono text-gray-500 flex justify-between">
                                        <span>STATUS:</span>
                                        <span className="text-green-500">{asset.stats.tertiary}</span>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        {(asset as any).details.map((detail: string, i: number) => (
                                            <div key={i} className="text-[7px] font-mono text-white/20">
                                                {`> ${detail}`}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Scanning Glitch Layer */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-20 z-20">
                                <motion.div 
                                    animate={{ y: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-x-0 h-[2px] bg-cyan-400 shadow-[0_0_15px_cyan]"
                                />
                            </div>

                            {/* Hexagon Detail */}
                            <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-100 transition-opacity">
                                <Search className="w-5 h-5 text-cyan-500 animate-pulse" />
                            </div>
                        </motion.div>
                    ))}
                    
                    <div className="md:col-span-3 h-24 flex items-center justify-center">
                        <div className="w-full h-px bg-cyan-500/20" />
                        <ShieldCheck className="w-8 h-8 text-cyan-500/40 mx-8" />
                        <div className="w-full h-px bg-cyan-500/20" />
                    </div>
                </div>

                {/* ADSTERRA BANNER PLACEMENT */}
                <div className="mt-20 w-full max-w-4xl mx-auto mb-20">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="relative p-8 rounded-[2.5rem] border border-cyan-500/30 bg-black/60 backdrop-blur-3xl text-center overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.1)]"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.1)_0%,transparent_70%)]" />
                        
                        <div className="relative z-10 flex items-center justify-center gap-4 mb-10">
                            <div className="h-px w-20 bg-gradient-to-r from-transparent to-cyan-500/50" />
                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-[0.4em]">COMMERCIAL_ARCHIVE_NODE</div>
                            <div className="h-px w-20 bg-gradient-to-l from-transparent to-cyan-500/50" />
                        </div>

                        {/* Adsterra Banner Container */}
                        <div className="flex justify-center mb-10">
                            <div className="relative w-full max-w-[728px] h-[90px] rounded-2xl overflow-hidden group cursor-pointer border-2 border-cyan-500/20 hover:border-cyan-400 transition-all">
                                <div className="absolute inset-0 bg-cyan-400/5 group-hover:bg-cyan-400/10 transition-colors" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="flex items-center gap-3 text-cyan-400 font-black text-[13px] uppercase tracking-widest mb-1">
                                        <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        Sponsor Uplink
                                    </div>
                                    <div className="text-[10px] font-mono text-cyan-500/40 uppercase tracking-[0.2em]">Adsterra High-Priority Deployment 0xAlpha</div>
                                </div>
                                <div className="absolute top-2 right-2 px-1.5 py-0.5 border border-cyan-500/30 rounded text-[8px] font-mono text-cyan-500/50">ADS</div>
                            </div>
                        </div>

                        <div className="relative z-10 grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            <button onClick={copyEmail} className="group relative flex flex-col items-center justify-center gap-2 py-8 px-10 bg-cyan-500 text-black font-black uppercase text-[11px] tracking-[0.2em] rounded-3xl hover:bg-white transition-all shadow-[0_0_40px_rgba(34,211,238,0.6)] overflow-hidden border-2 border-white/20">
                                <div className="flex items-center gap-4 relative z-10">
                                    <Mail className="w-8 h-8 animate-pulse" />
                                    <div className="text-left">
                                        <div className="text-[10px] opacity-60 font-mono mb-1">OFFICIAL_UPLINK_PROTOCOL</div>
                                        <span className="text-xl md:text-2xl font-black">arunpangu81125@gmail.com</span>
                                    </div>
                                </div>
                                <motion.div 
                                    className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)]"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                />
                            </button>
                            <div className="flex flex-col gap-4">
                                <button className="group relative flex items-center justify-center gap-3 py-5 px-8 bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-[0.2em] rounded-3xl hover:bg-white/10 transition-all border-b-4 border-b-cyan-500 shadow-xl">
                                    <Terminal className="w-5 h-5 text-cyan-400" />
                                    Portfolio_v9.exe
                                </button>
                                <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 text-center">
                                    <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1 animate-pulse">Uplink Encryption: Active</div>
                                    <div className="flex justify-center gap-1 opacity-40">
                                        {[1,2,3,4,5,6].map(i => <div key={i} className="w-1 h-3 bg-cyan-500 rounded-full" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Global Ad Uplink */}
                    <div className="mt-12 flex justify-center">
                        <div className="group cursor-pointer relative py-3 px-8 rounded-full border border-cyan-500/10 bg-cyan-500/5 backdrop-blur-sm overflow-hidden hover:border-cyan-500/40 transition-all">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <div className="relative flex items-center gap-3 text-[9px] font-mono text-cyan-400/60 uppercase tracking-[0.3em]">
                                <Activity className="w-3 h-3" />
                                Adsterra_Global_Network_Node_v9.2: Online
                                <ExternalLink className="w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Grain/Noise */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" style={{ backgroundImage: 'url(https://grainy-gradients.vercel.app/noise.svg)' }} />
          </motion.div>
        )}

        {stage === 'sunHub' && (
          <SunHubPlatform onExit={exitSunHub} />
        )}
      </AnimatePresence>
    </div>
  );
}
