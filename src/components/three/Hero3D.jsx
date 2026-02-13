import { useRef, useMemo, useCallback } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { Float, Sparkles, shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom shader for the organic morphing sphere
const OrganicMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uColorA: new THREE.Color('#2dd4bf'),
    uColorB: new THREE.Color('#818cf8'),
    uColorC: new THREE.Color('#38bdf8'),
    uFrequency: 1.5,
    uAmplitude: 0.35,
    uSpeed: 0.4,
  },
  // Vertex Shader
  `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uFrequency;
    uniform float uAmplitude;
    uniform float uSpeed;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;
    varying vec2 vUv;

    //	Simplex 3D Noise
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vUv = uv;
      vNormal = normal;

      float t = uTime * uSpeed;

      // Multi-octave noise for organic displacement
      float noise1 = snoise(position * uFrequency + t * 0.5);
      float noise2 = snoise(position * uFrequency * 2.0 + t * 0.3) * 0.5;
      float noise3 = snoise(position * uFrequency * 4.0 + t * 0.7) * 0.25;

      float displacement = (noise1 + noise2 + noise3) * uAmplitude;

      // Mouse influence - subtle attraction
      float mouseInfluence = smoothstep(2.0, 0.0, length(uMouse));
      displacement += mouseInfluence * 0.08 * sin(t * 2.0 + position.x * 3.0);

      vDisplacement = displacement;

      vec3 newPosition = position + normal * displacement;
      vPosition = newPosition;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;

    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDisplacement;
    varying vec2 vUv;

    void main() {
      // Fresnel effect for edge glow
      vec3 viewDirection = normalize(cameraPosition - vPosition);
      float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);

      // Color mixing based on displacement and position
      float colorMix1 = smoothstep(-0.3, 0.3, vDisplacement);
      float colorMix2 = smoothstep(-0.5, 0.5, sin(vUv.y * 6.28 + uTime * 0.3));

      vec3 baseColor = mix(uColorA, uColorB, colorMix1);
      baseColor = mix(baseColor, uColorC, colorMix2 * 0.4);

      // Add fresnel glow
      vec3 fresnelColor = mix(uColorA, uColorC, 0.5);
      vec3 finalColor = mix(baseColor, fresnelColor, fresnel * 0.8);

      // Subtle iridescence
      float iridescence = sin(vDisplacement * 10.0 + uTime * 0.5) * 0.5 + 0.5;
      finalColor += vec3(iridescence * 0.05);

      // Alpha based on fresnel for ethereal look
      float alpha = 0.6 + fresnel * 0.4;

      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ OrganicMaterial })

function MorphingSphere() {
  const meshRef = useRef()
  const materialRef = useRef()
  const { mouse, viewport } = useThree()

  const smoothMouse = useRef(new THREE.Vector2(0, 0))

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Smooth mouse tracking
    smoothMouse.current.x += (mouse.x * 0.5 - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (mouse.y * 0.5 - smoothMouse.current.y) * 0.03

    if (materialRef.current) {
      materialRef.current.uTime = t
      materialRef.current.uMouse.copy(smoothMouse.current)
    }

    if (meshRef.current) {
      // Gentle autonomous rotation
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.x = Math.sin(t * 0.1) * 0.1

      // Subtle breathing scale
      const breathe = 1 + Math.sin(t * 0.5) * 0.02
      meshRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={1.8}>
        <icosahedronGeometry args={[1, 64]} />
        <organicMaterial
          ref={materialRef}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Float>
  )
}

function InnerGlow() {
  const meshRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1.2 + Math.sin(t * 0.8) * 0.05)
      meshRef.current.rotation.y = t * 0.05
    }
  })

  return (
    <mesh ref={meshRef} scale={1.2}>
      <icosahedronGeometry args={[1, 32]} />
      <meshBasicMaterial
        color="#2dd4bf"
        transparent
        opacity={0.03}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

function OrbitalRing({ radius = 3, count = 80, speed = 0.3, color = '#2dd4bf', size = 0.02, yOffset = 0 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      const r = radius + (Math.random() - 0.5) * 0.4
      temp.push({
        angle,
        radius: r,
        speed: speed + (Math.random() - 0.5) * 0.1,
        y: yOffset + (Math.random() - 0.5) * 0.3,
        size: size + Math.random() * size,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return temp
  }, [count, radius, speed, size, yOffset])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    particles.forEach((p, i) => {
      const angle = p.angle + t * p.speed
      const x = Math.cos(angle) * p.radius
      const z = Math.sin(angle) * p.radius
      const y = p.y + Math.sin(t * 0.5 + p.phase) * 0.15

      dummy.position.set(x, y, z)
      const s = p.size * (0.7 + Math.sin(t * 2 + p.phase) * 0.3)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function AmbientParticles({ count = 200 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { mouse, viewport } = useThree()

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 15,
        speed: 0.005 + Math.random() * 0.01,
        size: 0.015 + Math.random() * 0.025,
        phase: Math.random() * Math.PI * 2,
        factor: 20 + Math.random() * 80,
        mx: 0,
        my: 0,
      })
    }
    return temp
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    particles.forEach((p, i) => {
      // Gentle drift
      const drift = Math.sin(t * p.speed * 10 + p.phase) * 0.3

      // Mouse interaction (very subtle)
      p.mx += (mouse.x * viewport.width * 0.15 - p.mx) * 0.008
      p.my += (mouse.y * viewport.height * 0.15 - p.my) * 0.008

      dummy.position.set(
        p.x + p.mx + drift,
        p.y + p.my + Math.cos(t * p.speed * 8 + p.phase) * 0.2,
        p.z + Math.sin(t * 0.1 + p.phase) * 0.5
      )

      const pulse = p.size * (0.6 + Math.sin(t * 1.5 + p.phase) * 0.4)
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#2dd4bf"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  )
}

function EnergyWisps({ count = 6 }) {
  const groupRef = useRef()
  const wisps = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        radius: 2 + Math.random() * 1.5,
        speed: 0.2 + Math.random() * 0.3,
        phase: (i / count) * Math.PI * 2,
        yAmplitude: 0.5 + Math.random() * 0.5,
        color: i % 2 === 0 ? '#2dd4bf' : '#818cf8',
      })
    }
    return temp
  }, [count])

  return (
    <group ref={groupRef}>
      {wisps.map((wisp, i) => (
        <WispTrail key={i} {...wisp} />
      ))}
    </group>
  )
}

function WispTrail({ radius, speed, phase, yAmplitude, color }) {
  const ref = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const angle = t * speed + phase
    ref.current.position.x = Math.cos(angle) * radius
    ref.current.position.z = Math.sin(angle) * radius
    ref.current.position.y = Math.sin(t * 0.5 + phase) * yAmplitude
  })

  return (
    <mesh ref={ref} scale={0.06}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function Hero3D() {
  return (
    <group position={[0, 0, 0]}>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#2dd4bf" distance={20} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#818cf8" distance={20} />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#38bdf8" distance={15} />

      {/* Central organic sphere */}
      <MorphingSphere />
      <InnerGlow />

      {/* Orbital particle rings */}
      <OrbitalRing radius={2.8} count={60} speed={0.25} color="#2dd4bf" size={0.02} yOffset={0} />
      <OrbitalRing radius={3.5} count={40} speed={-0.15} color="#818cf8" size={0.015} yOffset={0.3} />
      <OrbitalRing radius={4.2} count={30} speed={0.1} color="#38bdf8" size={0.018} yOffset={-0.2} />

      {/* Energy wisps orbiting */}
      <EnergyWisps count={5} />

      {/* Ambient floating particles */}
      <AmbientParticles count={150} />

      {/* Sparkle dust */}
      <Sparkles
        count={40}
        scale={8}
        size={3}
        speed={0.3}
        opacity={0.3}
        color="#2dd4bf"
      />
      <Sparkles
        count={20}
        scale={12}
        size={2}
        speed={0.2}
        opacity={0.2}
        color="#818cf8"
      />
    </group>
  )
}
