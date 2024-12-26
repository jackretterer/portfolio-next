'use client';
import { useEffect, useRef } from 'react';
import Link from "next/link";
import * as THREE from 'three';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scale = 2.5;

    // Event horizon
    const blackHoleGeometry = new THREE.SphereGeometry(1 * scale, 64, 64);
    const blackHoleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
                varying vec3 vPosition;
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                void main() {
                    vec3 center = vec3(0.0, 0.0, 0.0);
                    float dist = length(vPosition);
                    float intensity = 1.0 - smoothstep(0.8, 1.0, dist / ${scale.toFixed(1)});
                    vec3 color = mix(vec3(0.05, 0.05, 0.05), vec3(0.0, 0.0, 0.0), intensity);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
    });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    scene.add(blackHole);

    // Create multiple accretion disks
    const diskCount = 12;
    const disks: THREE.Mesh[] = [];
    const diskMaterials: THREE.ShaderMaterial[] = [];

    for (let i = 0; i < diskCount; i++) {
      const innerRadius = (1.2 + i * 0.3) * scale;
      const outerRadius = innerRadius + 0.46 * scale;
      const diskGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128, 64);
      const diskMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          
          #define PI 3.14159265359
          
          float rand(vec2 co) {
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
          }
          
          void main() {
            vec2 centeredUv = vUv - 0.5;
            float radius = length(centeredUv) * 2.0;
            float angle = atan(centeredUv.y, centeredUv.x);
            
            float rotationSpeed = 0.2 - float(${i}) * 0.02;
            float rotatedAngle = angle + time * rotationSpeed;
            
            vec3 baseColor = vec3(0.8, 0.1, 0.05);
            baseColor = mix(baseColor, vec3(0.1, 0.4, 0.8), float(${i}) / float(${diskCount - 1}));
            
            float gradientFactor = smoothstep(${outerRadius.toFixed(2)}, ${innerRadius.toFixed(2)}, radius);
            vec3 color = mix(baseColor * 0.3, baseColor, gradientFactor);
            
            color += vec3(0.1, 0.02, 0.01) * sin(rotatedAngle * 20.0 + time * 3.0);
            
            float dotSize = 0.02;
            float dotSpacing = 0.2;
            vec2 dotUv = vec2(fract(rotatedAngle / (2.0 * PI) + time * rotationSpeed), radius);
            float dotPattern = step(dotSpacing, mod(dotUv.x, dotSpacing)) * step(dotSpacing, mod(dotUv.y, dotSpacing));
            float dot = (1.0 - smoothstep(0.0, dotSize, length(fract(dotUv / dotSpacing) - 0.5))) * dotPattern;
            color = mix(color, vec3(1.0, 0.7, 0.5), dot * 0.7);
            
            float alpha = (1.0 - smoothstep(0.8, 1.0, radius)) * smoothstep(0.0, 0.2, radius);
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const disk = new THREE.Mesh(diskGeometry, diskMaterial);
      disk.rotation.x = Math.PI / 2;
      disk.rotation.z = (Math.PI / 4) * (i / (diskCount - 1)); // Gradually increase tilt
      scene.add(disk);
      disks.push(disk);
      diskMaterials.push(diskMaterial);
    }

    // Adjust camera position for a better view of all disks
    camera.position.set(20, 8, 0);
    camera.lookAt(0, 0, 0);

    // Update the animate function
    const animate = () => {
      requestAnimationFrame(animate);
      const time = performance.now() * 0.001;
      blackHoleMaterial.uniforms.time.value = time;

      disks.forEach((disk, index) => {
        diskMaterials[index].uniforms.time.value = time;
        disk.rotation.z += (0.3 - index * 0.03) * 0.01; // Gradually decrease rotation speed
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative h-[90vh] overflow-hidden bg-black">
      <div className="flex flex-col items-center">
      <h1 className="text-4xl text-center font-bold text-white mt-20">
          lost?
      </h1>
        </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}