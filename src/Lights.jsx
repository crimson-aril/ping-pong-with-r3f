// React hook to get references to objects
import { useRef } from 'react'

// useFrame runs code every frame (like requestAnimationFrame)
import { useFrame } from '@react-three/fiber'

export default function Lights() {
    // Ref for the directional light so we can move it dynamically
    const light = useRef()

    // Move the directional light to follow the camera each frame
    useFrame((state) => {
        // Make the light follow the camera's z-position
        light.current.position.z = state.camera.position.z + 1 - 4
        
        // Make the light target a little ahead of the camera
        light.current.target.position.z = state.camera.position.z - 4
        light.current.target.updateMatrixWorld() // Update target position
    })

    return (
        <>
            {/* Directional light simulates sunlight */}
            <directionalLight
                ref={light}                // Ref so we can move it in useFrame
                castShadow                 // Enables shadows
                position={[4, 4, 1]}       // Initial position of the light
                intensity={4.5}            // Brightness
                shadow-mapSize={[1024, 1024]} // Resolution of the shadow map
                shadow-camera-near={1}     // Near plane for shadows
                shadow-camera-far={10}     // Far plane for shadows
                shadow-camera-top={10}     // Shadow camera top boundary
                shadow-camera-right={10}   // Right boundary
                shadow-camera-bottom={-10} // Bottom boundary
                shadow-camera-left={-10}   // Left boundary
            />

            {/* Ambient light fills the scene so shadows aren’t pure black */}
            <ambientLight intensity={1.5} />
        </>
    )
}
