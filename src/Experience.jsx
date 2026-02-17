// Import Physics engine from Rapier for handling collisions and movement
import { Physics } from '@react-three/rapier'

// Import game state store (using Zustand) to track things like blocks count
import useGame from './stores/useGame.jsx'

// Import lights setup for the scene
import Lights from './Lights.jsx'

// Import the main level component (floor, blocks, obstacles, etc.)
import { Level } from './Level.jsx'

// Import the player (paddle/ball controller)
import Player from './Player.jsx'

// This is the main 3D scene component for the game
export default function Experience() {
    // Get the number of blocks and a random seed from the game store
    const blocksCount = useGame((state) => state.blocksCount)
    const blocksSeed = useGame((state) => state.blocksSeed)

    return (
        <>
            {/* Set the background color of the 3D scene */}
            <color args={['#bdedfc']} attach="background" />

            {/* Physics wraps the scene to enable gravity, collisions, and rigid bodies */}
            <Physics options={{ gravity: [0, -9.81, 0] }} debug={false}>
                {/* Lights component adds ambient, directional, and other lights */}
                <Lights />

                {/* Level component renders blocks, floor, and any obstacles */}
                {/* count: how many blocks; seed: for random placement */}
                <Level count={blocksCount} seed={blocksSeed} />

                {/* Player component is the paddle (or player-controlled object) */}
                <Player />
            </Physics>
        </>
    )
}
