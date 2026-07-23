import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ThreeCarHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.04);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 2.5, 7.5);
    camera.lookAt(0, 0.5, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x1a1a1a);
    scene.add(ambientLight);

    // Dynamic red spotlight sweep
    const spotLight = new THREE.SpotLight(0xc41e1e, 15, 30, Math.PI / 4, 0.5, 1);
    spotLight.position.set(5, 8, 2);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    // Red neon underglow light source
    const underglowLight = new THREE.PointLight(0xc41e1e, 6, 4);
    underglowLight.position.set(0, -0.1, 0);
    scene.add(underglowLight);

    // Cool rim light (white/blue to bring out metallic edges)
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    // 5. Procedural Tuner Car Model Group
    const carGroup = new THREE.Group();
    scene.add(carGroup);

    // Materials
    const bodyPaintMat = new THREE.MeshStandardMaterial({
      color: 0xc41e1e, // Blood Red
      roughness: 0.1,
      metalness: 0.9,
    });

    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x151515, // Carbon fiber dark
      roughness: 0.5,
      metalness: 0.7,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.05,
      metalness: 0.95,
      transparent: true,
      opacity: 0.85,
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.8,
    });

    const wheelSpokeMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.9,
    });

    const neonRedMat = new THREE.MeshBasicMaterial({
      color: 0xff3333,
    });

    const neonOrangeMat = new THREE.MeshBasicMaterial({
      color: 0xffaa00,
    });

    // --- CAR MODEL BUILDING ---
    // A. Main Lower Chassis
    const lowerChassisGeo = new THREE.BoxGeometry(4, 0.4, 1.8);
    const lowerChassis = new THREE.Mesh(lowerChassisGeo, bodyPaintMat);
    lowerChassis.position.y = 0.35;
    lowerChassis.receiveShadow = true;
    lowerChassis.castShadow = true;
    carGroup.add(lowerChassis);

    // B. Upper Cabin / Roof
    const cabinGeo = new THREE.BoxGeometry(2.2, 0.55, 1.4);
    const cabin = new THREE.Mesh(cabinGeo, bodyPaintMat);
    cabin.position.set(-0.2, 0.8, 0);
    cabin.castShadow = true;
    carGroup.add(cabin);

    // C. Windshield & Side Windows
    const windshieldGeo = new THREE.BoxGeometry(0.8, 0.5, 1.38);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0.7, 0.75, 0);
    windshield.rotation.z = -0.5; // Slope
    carGroup.add(windshield);

    const rearWindowGeo = new THREE.BoxGeometry(0.8, 0.45, 1.38);
    const rearWindow = new THREE.Mesh(rearWindowGeo, glassMat);
    rearWindow.position.set(-1.1, 0.75, 0);
    rearWindow.rotation.z = 0.4; // Rear Slope
    carGroup.add(rearWindow);

    // D. Hood (Carbon Fiber styling)
    const hoodGeo = new THREE.BoxGeometry(1.2, 0.15, 1.7);
    const hood = new THREE.Mesh(hoodGeo, carbonMat);
    hood.position.set(1.4, 0.45, 0);
    hood.rotation.z = -0.06;
    hood.castShadow = true;
    carGroup.add(hood);

    // E. Front Splitter (Aggressive low tuner lip)
    const splitterGeo = new THREE.BoxGeometry(0.4, 0.08, 1.9);
    const splitter = new THREE.Mesh(splitterGeo, carbonMat);
    splitter.position.set(2.1, 0.2, 0);
    carGroup.add(splitter);

    // F. Massive Rear Wing (Tuner Spoiler)
    const spoilerStrutsGeo = new THREE.BoxGeometry(0.1, 0.6, 1.2);
    const spoilerStruts = new THREE.Mesh(spoilerStrutsGeo, carbonMat);
    spoilerStruts.position.set(-1.8, 0.7, 0);
    spoilerStruts.rotation.z = -0.2;
    carGroup.add(spoilerStruts);

    const spoilerWingGeo = new THREE.BoxGeometry(0.5, 0.05, 1.9);
    const spoilerWing = new THREE.Mesh(spoilerWingGeo, carbonMat);
    spoilerWing.position.set(-1.85, 1.0, 0);
    spoilerWing.rotation.x = 0.05;
    carGroup.add(spoilerWing);

    const wingEndplatesGeo = new THREE.BoxGeometry(0.4, 0.3, 0.02);
    const leftEndplate = new THREE.Mesh(wingEndplatesGeo, bodyPaintMat);
    leftEndplate.position.set(-1.85, 1.0, 0.95);
    const rightEndplate = leftEndplate.clone();
    rightEndplate.position.z = -0.95;
    carGroup.add(leftEndplate);
    carGroup.add(rightEndplate);

    // G. Side Skirts
    const skirtGeo = new THREE.BoxGeometry(2.6, 0.1, 0.1);
    const leftSkirt = new THREE.Mesh(skirtGeo, carbonMat);
    leftSkirt.position.set(0, 0.2, 0.9);
    const rightSkirt = leftSkirt.clone();
    rightSkirt.position.z = -0.9;
    carGroup.add(leftSkirt);
    carGroup.add(rightSkirt);

    // H. Front Grill & Headlights (Neon LED strips)
    const lightBarGeo = new THREE.BoxGeometry(0.05, 0.08, 0.5);
    const leftHeadlight = new THREE.Mesh(lightBarGeo, neonOrangeMat);
    leftHeadlight.position.set(2.0, 0.45, 0.6);
    const rightHeadlight = leftHeadlight.clone();
    rightHeadlight.position.z = -0.6;
    carGroup.add(leftHeadlight);
    carGroup.add(rightHeadlight);

    // Tail lights
    const tailLightGeo = new THREE.BoxGeometry(0.05, 0.08, 0.6);
    const leftTailLight = new THREE.Mesh(tailLightGeo, neonRedMat);
    leftTailLight.position.set(-2.0, 0.48, 0.5);
    const rightTailLight = leftTailLight.clone();
    rightTailLight.position.z = -0.5;
    carGroup.add(leftTailLight);
    carGroup.add(rightTailLight);

    // Exhaust pipes (dual layout with orange glow inside)
    const exhaustGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8);
    exhaustGeo.rotateZ(Math.PI / 2);
    const leftExhaust = new THREE.Mesh(exhaustGeo, carbonMat);
    leftExhaust.position.set(-2.05, 0.22, 0.4);
    const rightExhaust = leftExhaust.clone();
    rightExhaust.position.z = -0.4;
    carGroup.add(leftExhaust);
    carGroup.add(rightExhaust);

    const exhaustGlowGeo = new THREE.CircleGeometry(0.04, 8);
    exhaustGlowGeo.rotateY(Math.PI / 2);
    const leftGlow = new THREE.Mesh(exhaustGlowGeo, neonRedMat);
    leftGlow.position.set(-2.26, 0.22, 0.4);
    const rightGlow = leftGlow.clone();
    rightGlow.position.z = -0.4;
    carGroup.add(leftGlow);
    carGroup.add(rightGlow);

    // I. Wheels & Rotating Spokes (Cylinder + Box spokes)
    const wheels: THREE.Group[] = [];
    const wheelPositions = [
      { x: 1.2, z: 0.92 },  // Front Right
      { x: 1.2, z: -0.92 }, // Front Left
      { x: -1.2, z: 0.92 }, // Rear Right
      { x: -1.2, z: -0.92 } // Rear Left
    ];

    const wheelTireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.35, 16);
    wheelTireGeo.rotateX(Math.PI / 2);

    const wheelHubGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.36, 12);
    wheelHubGeo.rotateX(Math.PI / 2);

    const spokeGeo = new THREE.BoxGeometry(0.04, 0.55, 0.04);

    wheelPositions.forEach((pos) => {
      const wGroup = new THREE.Group();
      wGroup.position.set(pos.x, 0.42, pos.z);

      const tire = new THREE.Mesh(wheelTireGeo, tireMat);
      tire.castShadow = true;
      wGroup.add(tire);

      const hub = new THREE.Mesh(wheelHubGeo, wheelSpokeMat);
      wGroup.add(hub);

      // Create 5 spokes for sports wheel look
      for (let i = 0; i < 5; i++) {
        const spoke = new THREE.Mesh(spokeGeo, wheelSpokeMat);
        spoke.rotation.z = (i * Math.PI * 2) / 5;
        wGroup.add(spoke);
      }

      carGroup.add(wGroup);
      wheels.push(wGroup);
    });

    // 6. Particle system (floating sparks)
    const particleCount = 60;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Spawn particles around the car
      positions[i * 3] = (Math.random() - 0.5) * 8;     // x
      positions[i * 3 + 1] = Math.random() * 4;         // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z
      speeds[i] = 0.01 + Math.random() * 0.02;          // rising speed
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Tiny orange/red glowing points
    const sparksMat = new THREE.PointsMaterial({
      color: 0xff5500,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeo, sparksMat);
    scene.add(particleSystem);

    // 7. Reflective Floor Grid
    const gridHelper = new THREE.GridHelper(40, 40, 0xc41e1e, 0x1a1a1a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Sub floor plate for shadow catching
    const shadowFloorGeo = new THREE.PlaneGeometry(30, 30);
    const shadowFloorMat = new THREE.ShadowMaterial({ opacity: 0.6 });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = 0;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // 8. Mouse parallax movement target
    let targetRotationX = 0;
    let targetRotationY = 0;
    let targetTiltZ = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize coordinate: -0.5 to 0.5
      const mouseX = (event.clientX / window.innerWidth) - 0.5;
      const mouseY = (event.clientY / window.innerHeight) - 0.5;

      // Map to subtle tilts
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.25;
      targetTiltZ = mouseY * 0.15;
    };

    window.addEventListener('mousemove', handleMouseMove);
    setLoading(false);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow hover bobbing
      carGroup.position.y = Math.sin(elapsedTime * 2) * 0.08;

      // Apply mouse parallax with easing
      carGroup.rotation.y += (targetRotationY - carGroup.rotation.y) * 0.05;
      carGroup.rotation.z += (targetRotationX - carGroup.rotation.z) * 0.05;
      carGroup.rotation.x += (targetTiltZ - carGroup.rotation.x) * 0.05;

      // Base rotation if no mouse interaction
      if (Math.abs(targetRotationY) < 0.01) {
        carGroup.rotation.y += 0.003;
      }

      // Rotate wheels to simulate driving forwards
      wheels.forEach((wheel) => {
        wheel.rotation.z += 0.08;
      });

      // Animate floating sparks particles
      const positionsAttr = particlesGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < particleCount; i++) {
        let y = positionsAttr.getY(i);
        y += speeds[i];
        if (y > 4) {
          y = 0; // reset to bottom
        }
        positionsAttr.setY(i, y);

        // Add subtle wind drift
        let x = positionsAttr.getX(i);
        x += Math.sin(elapsedTime + i) * 0.002;
        positionsAttr.setX(i, x);
      }
      positionsAttr.needsUpdate = true;

      // Oscillate spotlight position slightly
      spotLight.position.x = 5 + Math.sin(elapsedTime) * 1.5;
      spotLight.position.z = 2 + Math.cos(elapsedTime) * 1.5;

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      const h = newHeight || 500;
      camera.aspect = newWidth / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, h);
    });

    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      // dispose geometries/materials
      lowerChassisGeo.dispose();
      cabinGeo.dispose();
      windshieldGeo.dispose();
      rearWindowGeo.dispose();
      hoodGeo.dispose();
      splitterGeo.dispose();
      spoilerStrutsGeo.dispose();
      spoilerWingGeo.dispose();
      wingEndplatesGeo.dispose();
      skirtGeo.dispose();
      lightBarGeo.dispose();
      tailLightGeo.dispose();
      exhaustGeo.dispose();
      exhaustGlowGeo.dispose();
      wheelTireGeo.dispose();
      wheelHubGeo.dispose();
      spokeGeo.dispose();
      particlesGeo.dispose();
      shadowFloorGeo.dispose();
      
      bodyPaintMat.dispose();
      carbonMat.dispose();
      glassMat.dispose();
      tireMat.dispose();
      wheelSpokeMat.dispose();
      neonRedMat.dispose();
      neonOrangeMat.dispose();
      sparksMat.dispose();
      shadowFloorMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-black text-chrome-silver z-10">
          <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-mono text-xs tracking-widest text-blood-red animate-pulse">BOOTING 3D ENVIRONMENT</span>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 pointer-events-none" />
      
      {/* 3D scene interactions label */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-void-black/80 backdrop-blur-md px-4 py-2 border border-carbon-gray rounded-full z-10 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-blood-red animate-ping" />
        <span className="font-mono text-[10px] tracking-wider text-chrome-silver uppercase">
          MOVE MOUSE TO PARALLAX TILT THE RACER
        </span>
      </div>
    </div>
  );
}
