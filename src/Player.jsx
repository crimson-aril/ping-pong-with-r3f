// Rapier physics hooks
import { useRapier, RigidBody } from '@react-three/rapier'

// Runs code every frame
import { useFrame } from '@react-three/fiber'

// Keyboard input hook from Drei
import { useKeyboardControls } from '@react-three/drei'

// React hooks
import { useState, useEffect, useRef } from 'react'

// Three.js core for vectors, math, etc.
import * as THREE from 'three'

// Game state store
import useGame from './stores/useGame.jsx'

export default function Player() {
    // Ref to the physics body of the player
    const body = useRef()

    // Keyboard controls: subscribeKeys lets you listen to key changes, getKeys gets current key states
    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    // Rapier physics world
    const { rapier, world } = useRapier()

    // Smooth camera movement vectors
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    // Game state functions
    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const blocksCount = useGame((state) => state.blocksCount)

    /**
     * Jump function
     * - Casts a small ray downwards to see if player is on the ground
     * - Only jumps if close enough to a surface
     */
    const jump = () => {
        if (!body.current || !world) return  // Prevent errors if physics not ready

        const origin = body.current.translation()
        origin.y -= 0.31
        const direction = { x: 0, y: -1, z: 0 } // Ray points down
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray, 10, true)

        if (hit && hit.timeOfImpact < 0.15) {
            body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }) // Jump impulse
        }
    }

    /**
     * Reset player position and velocity
     * - Called when game is ready to restart
     */
    const reset = () => {
        body.current.setTranslation({ x: 0, y: 1, z: 0 })
        body.current.setLinvel({ x: 0, y: 0, z: 0 }) // Stop movement
        body.current.setAngvel({ x: 0, y: 0, z: 0 }) // Stop spinning
    }

    // Subscribe to game events and keyboard
    useEffect(() => {
        // Reset when game phase becomes "ready"
        const unsubscribeReset = useGame.subscribe(
            (state) => state.phase,
            (value) => {
                if(value === 'ready') reset()
            }
        )

        // Listen for jump key presses
        const unsubscribeJump = subscribeKeys(
            (state) => state.jump,
            (value) => {
                if(value) jump()
            }
        )

        // Start game on any key press
        const unsubscribeAny = subscribeKeys(() => {
            start()
        })

        return () => {
            unsubscribeReset()
            unsubscribeJump()
            unsubscribeAny()
        }
    }, [])

    // Runs every frame for movement, camera, and game phase checks
    useFrame((state, delta) => {
        if (!body.current) return // Bail out if physics body not ready

        // Get movement keys
        const { forward, backward, leftward, rightward } = getKeys()

        const impulse = { x: 0, y: 0, z: 0 } // Push force
        const torque = { x: 0, y: 0, z: 0 }  // Spin force

        const impulseStrength = 0.6 * delta
        const torqueStrength = 0.2 * delta

        // Apply movement and torque based on keys
        if(forward) { impulse.z -= impulseStrength; torque.x -= torqueStrength }
        if(rightward) { impulse.x += impulseStrength; torque.z -= torqueStrength }
        if(backward) { impulse.z += impulseStrength; torque.x += torqueStrength }
        if(leftward) { impulse.x -= impulseStrength; torque.z += torqueStrength }

        body.current.applyImpulse(impulse)
        body.current.applyTorqueImpulse(torque)

        // Smooth camera following
        const bodyPosition = body.current.translation()
        const cameraPosition = new THREE.Vector3().copy(bodyPosition)
        cameraPosition.z += 2.25
        cameraPosition.y += 0.65

        const cameraTarget = new THREE.Vector3().copy(bodyPosition)
        cameraTarget.y += 0.25

        // Lerp = smooth transition
        smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
        smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

        state.camera.position.copy(smoothedCameraPosition)
        state.camera.lookAt(smoothedCameraTarget)

        // End / restart conditions
        if(bodyPosition.z < -(blocksCount * 4 + 2)) end()      // Reached end
        if(bodyPosition.y < -4) restart()                     // Fell off
    })

    return (
        <RigidBody
            ref={ body }
            canSleep={ false }        // Always active
            colliders="ball"          // Use sphere collider
            restitution={ 0.2 }      // Bounciness
            friction={ 1 } 
            linearDamping={ 0.5 }    // Slow down over time
            angularDamping={ 0.5 }   // Reduce spin over time
            position={ [0, 1, 0] }   // Start position
        >
            {/* Visual mesh */}
            <mesh castShadow>
                <icosahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial flatShading color="mediumpurple" />
            </mesh>
        </RigidBody>
    )
}
