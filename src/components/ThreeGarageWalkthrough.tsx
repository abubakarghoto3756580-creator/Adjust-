import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Hotspot {
  id: string;
  name: string;
  position: [number, number, number];
  title: string;
  description: string;
  equipment: string;
  avgCost: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'dyno-bay',
    name: '💻 Tuning & ECU Dyno Bay',
    position: [2.5, 0.8, -1.8],
    title: 'Diagnostic & ECU Remap Bay',
    description: 'Equipped with a Mainline AWD Dyno capable of supporting up to 2000 HP. This is where we calibrate fuel maps, boost pressures, and ignition timing for maximum reliable performance.',
    equipment: 'Mainline AWD Chassis Dynamometer, Bosch Gas Analyzers, Plex Knock Monitor',
    avgCost: '$180 - $250 / Hr'
  },
  {
    id: 'lift-station',
    name: '🔧 High-Lift Build Bay',
    position: [0, 1.8, 0],
    title: 'Engine & Suspension Lift Station',
    description: 'Our heavy-duty rotary hydraulic lifts elevate projects for turbo manifold plumbing, coilover corner balancing, or full exhaust TIG welding.',
    equipment: 'Rotary 2-Post Hydraulic Lift, Snap-on TechAngle Torque Wrenches, Hunter Wheel Alignment',
    avgCost: '$150 / Hr (Labor)'
  },
  {
    id: 'fab-bench',
    name: '🔥 Exhaust & Fabrication Hearth',
    position: [-2.5, 0.6, 1.5],
    title: 'TIG Exhaust & Fab Workshop',
    description: 'Where our fabricators hand-make custom downpipes and catbacks from premium Grade-9 Titanium or 304 Stainless Steel. Every weld is gas-purged for absolute strength.',
    equipment: 'Miller Syncrowave TIG Welder, Hydraulic Tube Bender, Purge Gas Regulators',
    avgCost: '$165 / Hr (Custom Fab)'
  }
];

export default function ThreeGarageWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewAngle, setViewAngle] = useState('Front');

  // Track coordinates for custom orbit controls
  const cameraAngleRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3.5, radius: 9 });
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    
    // Position camera using polar coordinates
    const updateCameraPosition = () => {
      const { theta, phi, radius } = cameraAngleRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 0.8, 0);
    };
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // 4. Ambient & Neon Lighting
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // Floor Spotlights
    const centralLight = new THREE.DirectionalLight(0xffffff, 0.5);
    centralLight.position.set(0, 10, 0);
    centralLight.castShadow = true;
    scene.add(centralLight);

    // Red neon strip wall light (cylindrical neon glow)
    const neonGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 8);
    const neonMat = new THREE.MeshBasicMaterial({ color: 0xc41e1e });
    const wallNeon = new THREE.Mesh(neonGeo, neonMat);
    wallNeon.rotation.z = Math.PI / 2;
    wallNeon.position.set(0, 2.5, -3.9);
    scene.add(wallNeon);

    const wallNeonLight = new THREE.PointLight(0xc41e1e, 3, 10);
    wallNeonLight.position.set(0, 2.5, -3.8);
    scene.add(wallNeonLight);

    // Green neon indicator light in the tuning bay
    const greenNeon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 3, 8),
      new THREE.MeshBasicMaterial({ color: 0x33ff33 })
    );
    greenNeon.position.set(3.8, 2, -1.8);
    scene.add(greenNeon);

    // 5. Build Garage Structure
    // A. Concrete Floor
    const floorGeo = new THREE.BoxGeometry(12, 0.1, 10);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f, // Dark industrial concrete
      roughness: 0.6,
      metalness: 0.1
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid details on floor
    const floorGrid = new THREE.GridHelper(12, 12, 0xc41e1e, 0x222222);
    floorGrid.position.y = 0.01;
    scene.add(floorGrid);

    // B. Main Back Wall
    const backWallGeo = new THREE.BoxGeometry(12, 4, 0.2);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.9,
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 2, -4);
    scene.add(backWall);

    // Diagonal warning stripes on wall (Mesh styling)
    const stripesGroup = new THREE.Group();
    for (let i = -5; i <= 5; i += 2) {
      const stripeGeo = new THREE.BoxGeometry(0.25, 1, 0.02);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0x1c1c1c });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.position.set(i, 0.5, -3.88);
      stripe.rotation.z = Math.PI / 4;
      stripesGroup.add(stripe);
    }
    scene.add(stripesGroup);

    // C. Side Pillars
    const pillarGeo = new THREE.BoxGeometry(0.4, 4, 0.4);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x080808,
      metalness: 0.8,
      roughness: 0.2
    });
    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-5.8, 2, -3.8);
    const rightPillar = leftPillar.clone();
    rightPillar.position.x = 5.8;
    scene.add(leftPillar);
    scene.add(rightPillar);

    // 6. Two-Post Hydraulic Lift Structure (Center)
    const liftGroup = new THREE.Group();
    scene.add(liftGroup);

    const postGeo = new THREE.BoxGeometry(0.2, 3.2, 0.4);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x2e2e2e, metalness: 0.8, roughness: 0.3 });
    
    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-1.6, 1.6, 0);
    const rightPost = leftPost.clone();
    rightPost.position.x = 1.6;
    liftGroup.add(leftPost);
    liftGroup.add(rightPost);

    // Lift horizontal bars holding the car
    const crossbarGeo = new THREE.BoxGeometry(3.1, 0.12, 1.2);
    const crossbarMat = new THREE.MeshStandardMaterial({ color: 0xc41e1e, metalness: 0.9, roughness: 0.1 });
    const crossbar = new THREE.Mesh(crossbarGeo, crossbarMat);
    crossbar.position.set(0, 1.2, 0); // Raised up
    liftGroup.add(crossbar);

    // 7. Simpler 3D Sports Car on the Lift
    const carLiftGroup = new THREE.Group();
    carLiftGroup.position.set(0, 1.26, 0); // Raised above lift crossbar
    scene.add(carLiftGroup);

    // Yellow Tuner Car body
    const liftCarBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.35, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xffee00, metalness: 0.9, roughness: 0.1 })
    );
    liftCarBody.position.y = 0.18;
    carLiftGroup.add(liftCarBody);

    const liftCarCabin = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 0.35, 0.9),
      new THREE.MeshStandardMaterial({ color: 0x0c0c0c, roughness: 0.1 })
    );
    liftCarCabin.position.set(-0.1, 0.45, 0);
    carLiftGroup.add(liftCarCabin);

    // Exhaust pipes with active gas (represented by long cylinders)
    const exhaustBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.9 })
    );
    exhaustBack.rotation.z = Math.PI / 2;
    exhaustBack.position.set(-1.3, 0.1, 0.25);
    carLiftGroup.add(exhaustBack);

    // 8. Workbenches & Stations
    // A. Dyno Monitor Rack (Right side)
    const dynoConsole = new THREE.Group();
    dynoConsole.position.set(3.5, 0, -2.5);
    scene.add(dynoConsole);

    const deskGeo = new THREE.BoxGeometry(1.5, 0.8, 0.8);
    const desk = new THREE.Mesh(deskGeo, pillarMat);
    desk.position.y = 0.4;
    dynoConsole.add(desk);

    // Monitor
    const screenGeo = new THREE.BoxGeometry(0.1, 0.6, 0.9);
    const screenMat = new THREE.MeshBasicMaterial({ color: 0x151515 }); // off screen or glowing
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(-0.4, 1.1, 0);
    screen.rotation.y = -Math.PI / 6;
    dynoConsole.add(screen);

    // B. Weld & Fab Cart (Left Side)
    const fabCart = new THREE.Group();
    fabCart.position.set(-3.5, 0, 1.5);
    scene.add(fabCart);

    const cartDesk = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 1.2), postMat);
    cartDesk.position.y = 0.3;
    fabCart.add(cartDesk);

    const gasTankGeo = new THREE.CylinderGeometry(0.15, 0.15, 1.0, 12);
    const gasTank = new THREE.Mesh(gasTankGeo, new THREE.MeshStandardMaterial({ color: 0x0077ff, metalness: 0.8 }));
    gasTank.position.set(-0.3, 0.6, 0.4);
    fabCart.add(gasTank);

    // 9. Hotspots (Pulsating spheres in 3D scene)
    const hotspotMeshes: THREE.Mesh[] = [];
    HOTSPOTS.forEach((hs) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(...hs.position);

      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: 0xc41e1e,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      hGroup.add(sphere);

      // outer glowing ring
      const ringGeo = new THREE.RingGeometry(0.22, 0.3, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xc41e1e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      hGroup.add(ring);

      // tag metadata to mesh for raycasting
      sphere.userData = { hotspot: hs };
      
      scene.add(hGroup);
      hotspotMeshes.push(sphere);
    });

    // 10. Drag handlers for Custom Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      const scale = 0.005;
      cameraAngleRef.current.theta -= deltaX * scale;
      
      // Constraint vertical angle (phi)
      cameraAngleRef.current.phi = Math.max(
        0.1, 
        Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * scale)
      );

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      updateCameraPosition();
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;

      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      const scale = 0.008;
      cameraAngleRef.current.theta -= deltaX * scale;
      cameraAngleRef.current.phi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * scale)
      );

      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      updateCameraPosition();
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    domEl.addEventListener('touchstart', handleTouchStart);
    domEl.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    // 11. Raycast Hotspot clicks in 3D
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleCanvasClick = (e: MouseEvent) => {
      // Get click coords relative to canvas container
      const rect = domEl.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hotspotMeshes);

      if (intersects.length > 0) {
        const hs = intersects[0].object.userData.hotspot as Hotspot;
        setActiveHotspot(hs);
      }
    };
    domEl.addEventListener('click', handleCanvasClick);

    setLoading(false);

    // 12. Anim loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow orbital rotate when not dragging
      if (!isDraggingRef.current && !activeHotspot) {
        cameraAngleRef.current.theta += 0.0012;
        updateCameraPosition();
      }

      // Pulse all hotspots
      hotspotMeshes.forEach((mesh) => {
        const scale = 1 + Math.sin(elapsedTime * 6) * 0.15;
        mesh.scale.set(scale, scale, scale);
        // rotate parent rings
        if (mesh.parent) {
          const ring = mesh.parent.children[1];
          if (ring && ring instanceof THREE.Mesh) {
            ring.rotation.z += 0.02;
            const op = 0.3 + Math.sin(elapsedTime * 6) * 0.15;
            if (Array.isArray(ring.material)) {
              // no-op
            } else if (ring.material) {
              ring.material.opacity = op;
            }
          }
        }
      });

      // Slowly bob the car on the lift to simulate compression checks
      carLiftGroup.position.y = 1.26 + Math.sin(elapsedTime * 1.5) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: nw, height: nh } = entries[0].contentRect;
      const h = nh || 500;
      camera.aspect = nw / h;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, h);
    });
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (containerRef.current && domEl) {
        containerRef.current.removeChild(domEl);
      }
      domEl.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domEl.removeEventListener('touchstart', handleTouchStart);
      domEl.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      domEl.removeEventListener('click', handleCanvasClick);

      // dispose geometries/materials
      floorGeo.dispose();
      backWallGeo.dispose();
      pillarGeo.dispose();
      postGeo.dispose();
      crossbarGeo.dispose();
      liftCarBody.geometry.dispose();
      liftCarCabin.geometry.dispose();
      exhaustBack.geometry.dispose();
      deskGeo.dispose();
      screenGeo.dispose();
      cartDesk.geometry.dispose();
      gasTankGeo.dispose();
      neonGeo.dispose();
      
      floorMat.dispose();
      wallMat.dispose();
      pillarMat.dispose();
      postMat.dispose();
      crossbarMat.dispose();
      liftCarBody.material.dispose();
      liftCarCabin.material.dispose();
      exhaustBack.material.dispose();
      screenMat.dispose();
      cartDesk.material.dispose();
      gasTank.material.dispose();
      neonMat.dispose();
      wallNeonLight.dispose();
      centralLight.dispose();
      ambientLight.dispose();
      renderer.dispose();
    };
  }, [activeHotspot]);

  // Jump camera to preset perspectives
  const triggerJumpAngle = (angle: string) => {
    setViewAngle(angle);
    if (angle === 'Front') {
      cameraAngleRef.current = { theta: 0.1, phi: Math.PI / 3.5, radius: 9 };
    } else if (angle === 'ECU Dyno') {
      cameraAngleRef.current = { theta: Math.PI / 3.8, phi: Math.PI / 4, radius: 7.5 };
    } else if (angle === 'Fabrication') {
      cameraAngleRef.current = { theta: -Math.PI / 3, phi: Math.PI / 4, radius: 7.5 };
    } else if (angle === 'Birdseye') {
      cameraAngleRef.current = { theta: Math.PI / 4, phi: 0.15, radius: 9.5 };
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col justify-end overflow-hidden border border-carbon-gray rounded-xl bg-void-black">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-void-black text-chrome-silver z-10">
          <div className="w-12 h-12 border-4 border-blood-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="font-mono text-xs tracking-widest text-blood-red animate-pulse">RENDERING 3D WORKSHOP</span>
        </div>
      )}

      {/* 3D Canvas Container */}
      <div ref={containerRef} className="w-full h-[500px] absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Navigation Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-[200px] bg-void-black/90 backdrop-blur-md p-3 border border-carbon-gray rounded-lg">
        <span className="font-rajdhani text-xs uppercase tracking-widest font-semibold text-blood-red">PERSPECTIVES</span>
        <div className="grid grid-cols-2 gap-1.5">
          {['Front', 'ECU Dyno', 'Fabrication', 'Birdseye'].map((ang) => (
            <button
              key={ang}
              onClick={() => triggerJumpAngle(ang)}
              className={`px-2 py-1.5 rounded text-[10px] font-mono border transition-all ${
                viewAngle === ang
                  ? 'bg-blood-red text-steel-white border-blood-red font-bold'
                  : 'bg-void-black border-neutral-800 text-chrome-silver hover:border-blood-red'
              }`}
            >
              {ang}
            </button>
          ))}
        </div>
      </div>

      {/* Draggable indicator prompt */}
      <div className="absolute top-4 right-4 z-10 bg-void-black/80 backdrop-blur-sm px-3 py-1.5 border border-carbon-gray rounded-full pointer-events-none">
        <p className="font-mono text-[10px] text-chrome-silver flex items-center gap-1.5">
          <span>↔</span> Drag to rotate / orbit
        </p>
      </div>

      {/* Bottom Quick Hub of Hotspots */}
      <div className="relative z-10 w-full p-4 md:p-6 bg-gradient-to-t from-void-black via-void-black/95 to-transparent flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h4 className="font-rajdhani text-sm font-bold text-blood-red tracking-wider uppercase">CLICK A HOTSPOT NODE TO INSPECT</h4>
          <p className="text-xs text-chrome-silver">Click either the glowing red nodes inside the 3D grid, or select from below:</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {HOTSPOTS.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(hs)}
              className={`px-3 py-2 text-xs rounded border font-rajdhani font-semibold transition-all flex items-center gap-1.5 ${
                activeHotspot?.id === hs.id
                  ? 'bg-blood-red/25 border-blood-red text-steel-white box-glow-red'
                  : 'bg-carbon-gray/60 border-neutral-800 text-chrome-silver hover:border-neutral-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blood-red animate-pulse" />
              {hs.name}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Modal/Drawer for active hotspot info */}
      {activeHotspot && (
        <div className="absolute inset-x-0 bottom-0 z-20 bg-neutral-950/98 border-t border-blood-red/40 p-6 md:p-8 animate-slide-up">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="flex-1 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="bg-blood-red text-steel-white font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-semibold">
                  ACTIVE STATION
                </span>
                <h3 className="font-bebas text-2xl md:text-3xl text-steel-white tracking-wider uppercase">
                  {activeHotspot.title}
                </h3>
              </div>
              <p className="text-sm text-chrome-silver leading-relaxed">
                {activeHotspot.description}
              </p>
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="font-mono text-xs text-blood-red uppercase">Core Equipment In-Shop:</span>
                <p className="text-xs text-steel-white italic bg-carbon-gray/50 p-2.5 border border-neutral-900 rounded font-sans">
                  {activeHotspot.equipment}
                </p>
              </div>
            </div>

            <div className="w-full md:w-[240px] bg-carbon-gray/40 border border-neutral-900 p-4 rounded-lg flex flex-col gap-4 self-stretch justify-between">
              <div>
                <span className="text-[10px] font-mono text-chrome-silver block uppercase">Estimated Rates</span>
                <p className="font-bebas text-3xl text-steel-white tracking-wider mt-1">{activeHotspot.avgCost}</p>
                <p className="text-[10px] text-chrome-silver mt-1 leading-snug">Includes master technician labor & high-end diagnostics logs.</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const bookingForm = document.getElementById('booking-section');
                    if (bookingForm) bookingForm.scrollIntoView({ behavior: 'smooth' });
                    setActiveHotspot(null);
                  }}
                  className="flex-1 text-center bg-blood-red hover:bg-red-700 text-steel-white py-2 text-xs font-rajdhani font-bold rounded uppercase transition-colors"
                >
                  Book Station
                </button>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="px-3 bg-neutral-800 hover:bg-neutral-700 text-chrome-silver py-2 text-xs font-mono rounded uppercase transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
