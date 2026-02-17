// Three.js core library for geometry, colors, quaternions, etc.
import * as THREE from 'three'

// Rapier physics: RigidBody for dynamic/static objects, CuboidCollider for invisible colliders
import { CuboidCollider, RigidBody } from '@react-three/rapier'

// React hooks
import { useMemo, useState, useRef } from 'react'

// Runs code every frame for animation/physics updates
import { useFrame } from '@react-three/fiber'

// Drei helpers: Float makes objects float, Text renders 3D text, useGLTF loads 3D models
import { Float, Text, useGLTF } from '@react-three/drei'

// Shared box geometry for all blocks
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

// Different materials for floors, obstacles, and walls
const floor1Material = new THREE.MeshStandardMaterial({ color: 'limegreen' })
const floor2Material = new THREE.MeshStandardMaterial({ color: 'greenyellow' })
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 'orangered' })
const wallMaterial = new THREE.MeshStandardMaterial({ color: 'slategrey' })

/**
 * Start Block
 * - Floating "Marble Race" text
 * - Floor to start the game
 */
export function BlockStart({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      {/* Floating 3D Text */}
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="bebas-neue-v9-latin-regular.woff"
          scale={0.5}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>

      {/* Floor mesh */}
      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
    </group>
  )
}

/**
 * End Block
 * - Finish text
 * - Floor
 * - Hamburger model as reward
 */
export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF(new URL('/hamburger.glb', import.meta.url).href) // Load 3D model

  // Make all meshes cast shadows
  hamburger.scene.children.forEach((mesh) => (mesh.castShadow = true))

  return (
    <group position={position}>
      <Text font={new URL('bebas-neue-v9-latin-regular.woff', import.meta.url).href} scale={1} position={[0, 2.25, 2]}>
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>

      {/* Floor */}
      <mesh geometry={boxGeometry} material={floor1Material} position={[0, 0, 0]} scale={[4, 0.2, 4]} receiveShadow />

      {/* Hamburger reward with physics */}
      <RigidBody type="fixed" colliders="hull" position={[0, 0.25, 0]} restitution={0.2} friction={0}>
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  )
}

/**
 * Spinner Obstacle Block
 * - Rotates a horizontal bar around Y-axis
 */
export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  // Random speed and direction
  const [speed] = useState(() => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1))

  // Animate obstacle every frame
  useFrame((state) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, time * speed, 0))
    obstacle.current.setNextKinematicRotation(rotation)
  })

  return (
    <group position={position}>
      {/* Floor */}
      <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
      
      {/* Rotating obstacle */}
      <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
      </RigidBody>
    </group>
  )
}

/**
 * Limbo Obstacle Block
 * - Horizontal bar moves up and down like limbo
 */
export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const y = Math.sin(time + timeOffset) + 1.15
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2]
    })
  })

  return (
    <group position={position}>
      <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
      <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[3.5, 0.3, 0.3]} castShadow receiveShadow />
      </RigidBody>
    </group>
  )
}

/**
 * Axe Obstacle Block
 * - Horizontal bar swings left and right like an axe
 */
export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef()
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2)

  useFrame((state) => {
    if (!obstacle.current) return
    const time = state.clock.getElapsedTime()
    const x = Math.sin(time + timeOffset) * 1.25
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2]
    })
  })

  return (
    <group position={position}>
      <mesh geometry={boxGeometry} material={floor2Material} position={[0, -0.1, 0]} scale={[4, 0.2, 4]} receiveShadow />
      <RigidBody ref={obstacle} type="kinematicPosition" position={[0, 0.3, 0]} restitution={0.2} friction={0}>
        <mesh geometry={boxGeometry} material={obstacleMaterial} scale={[1.5, 1.5, 0.3]} castShadow receiveShadow />
      </RigidBody>
    </group>
  )
}

/**
 * Bounds / Walls
 * - Invisible colliders and visible walls around the level
 */
function Bounds({ length = 1 }) {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh position={[2.15, 0.75, -(length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.3, 1.5, 4 * length]} castShadow />
        <mesh position={[-2.15, 0.75, -(length * 2) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[0.3, 1.5, 4 * length]} receiveShadow />
        <mesh position={[0, 0.75, -(length * 4) + 2]} geometry={boxGeometry} material={wallMaterial} scale={[4, 1.5, 0.3]} receiveShadow />
        {/* Invisible floor collider to prevent falling off */}
        <CuboidCollider type="fixed" args={[2, 0.1, 2 * length]} position={[0, -0.1, -(length * 2) + 2]} restitution={0.2} friction={1} />
      </RigidBody>
    </>
  )
}

/**
 * Level Component
 * - Generates a start block, random obstacle blocks, end block, and bounds
 */
export function Level({ count = 5, types = [BlockSpinner, BlockAxe, BlockLimbo], seed = 0 }) {
  // Memoize the blocks so they don't regenerate every frame
  const blocks = useMemo(() => {
    const blocksArray = []
    for (let i = 0; i < count; i++) {
      // Pick a random block type
      const type = types[Math.floor(Math.random() * types.length)]
      blocksArray.push(type)
    }
    return blocksArray
  }, [count, types, seed])

  return (
    <>
      {/* Start, dynamic blocks, end, and walls */}
      <BlockStart position={[0, 0, 0]} />
      {blocks.map((Block, index) => <Block key={index} position={[0, 0, -(index + 1) * 4]} />)}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  )
}
