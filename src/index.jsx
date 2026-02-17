// Import the main CSS for styling the page and UI
import './style.css'

// Import ReactDOM to render our React app into the HTML
import ReactDOM from 'react-dom/client'

// Import Canvas from React Three Fiber (R3F) to render 3D scenes
import { Canvas } from '@react-three/fiber'

// Import the main 3D scene component where the ping pong game lives
import Experience from './Experience.jsx'

// Import helper for keyboard controls from Drei (R3F helper library)
import { KeyboardControls } from '@react-three/drei'

// Import UI overlay component (score, time, restart, etc.)
import Interface from './Interface.jsx'

// -----------------------------
// Optional: suppress annoying console warnings
// This avoids deprecated parameter warnings when initializing Drei's KeyboardControls
const origWarn = console.warn
console.warn = (...args) => {
  if (args[0]?.includes?.('deprecated parameters for the initialization function')) return
  origWarn(...args)
}

// -----------------------------
// Get the root element where React will inject the app
const root = ReactDOM.createRoot(document.querySelector('#root'))

// -----------------------------
// Render the entire app
root.render(
    // KeyboardControls provides a context for managing key presses
    <KeyboardControls
        map={[
            { name: 'forward', keys: ['ArrowUp', 'KeyW'] },   // Move paddle forward
            { name: 'backward', keys: ['ArrowDown', 'KeyS'] }, // Move paddle backward
            { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] }, // Move paddle left
            { name: 'rightward', keys: ['ArrowRight', 'KeyD'] }, // Move paddle right
            { name: 'jump', keys: ['Space'] },                // Jump action (if used)
        ]}
    >
        {/* Canvas is the 3D rendering area */}
        <Canvas
            shadows // Enable shadows for realistic lighting
            camera={{
                fov: 45,        // Field of view
                near: 0.1,      // How close the camera can see
                far: 200,       // How far the camera can see
                position: [2.5, 4, 6] // Starting camera position in 3D space
            }}
        >
            {/* Experience is our main 3D scene (game objects, lights, physics) */}
            <Experience />
        </Canvas>

        {/* Interface is the overlay UI (score, time, controls, restart button) */}
        <Interface />
    </KeyboardControls>
)
