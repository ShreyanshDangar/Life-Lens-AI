import { Canvas } from '@react-three/fiber'
import { Suspense, lazy, useMemo } from 'react'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { Preload } from '@react-three/drei'

const Hero3D = lazy(() => import('./Hero3D'))

function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.4}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
        radius={0.8}
      />
      <Vignette
        offset={0.3}
        darkness={0.6}
        eskil={false}
      />
    </EffectComposer>
  )
}

export default function Experience() {
  return (
    <div id="canvas-container">
      <Canvas
        eventSource={document.getElementById('root')}
        eventPrefix="client"
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <Hero3D />
          <Effects />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
