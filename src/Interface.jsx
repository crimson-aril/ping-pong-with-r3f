// Import hook to read keyboard input from the Drei KeyboardControls
import { useKeyboardControls } from '@react-three/drei'

// Import the game state store (Zustand)
import useGame from './stores/useGame.jsx'

// React hooks
import { useEffect, useRef } from 'react'

// Add an effect that runs every frame in the R3F render loop
import { addEffect } from '@react-three/fiber'

export default function Interface() {
    // Ref for the time display element
    const time = useRef()

    // Get the restart function and current game phase from the store
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)

    // Read the current keyboard state for each action
    const forward = useKeyboardControls((state) => state.forward)
    const backward = useKeyboardControls((state) => state.backward)
    const leftward = useKeyboardControls((state) => state.leftward)
    const rightward = useKeyboardControls((state) => state.rightward)
    const jump = useKeyboardControls((state) => state.jump)

    // Update the timer every frame
    useEffect(() => {
        // addEffect runs every frame (like requestAnimationFrame)
        const unsubscribeEffect = addEffect(() => {
            // Get the latest game state
            const state = useGame.getState()

            let elapsedTime = 0

            // Calculate elapsed time based on game phase
            if(state.phase === 'playing')
                elapsedTime = Date.now() - state.startTime
            else if(state.phase === 'ended')
                elapsedTime = state.endTime - state.startTime

            // Convert to seconds and keep 2 decimal places
            elapsedTime /= 1000
            elapsedTime = elapsedTime.toFixed(2)

            // Update the DOM element for the timer
            if(time.current)
                time.current.textContent = elapsedTime
        })

        // Clean up when component unmounts
        return () => {
            unsubscribeEffect()
        }
    }, [])

    return (
        <div className="interface">

            {/* Timer display at the top */}
            <div ref={ time } className="time">0.00</div>

            {/* Restart button appears only when the game has ended */}
            { phase === 'ended' && <div className="restart" onClick={ restart }>Restart</div> }

            {/* Visual keyboard controls overlay */}
            <div className="controls">

                {/* Forward key (top row) */}
                <div className="raw">
                    <div className={ `key ${ forward ? 'active' : '' }` }></div>
                </div>

                {/* Left, Backward, Right keys (middle row) */}
                <div className="raw">
                    <div className={ `key ${ leftward ? 'active' : '' }` }></div>
                    <div className={ `key ${ backward ? 'active' : '' }` }></div>
                    <div className={ `key ${ rightward ? 'active' : '' }` }></div>
                </div>

                {/* Jump key (bottom row, larger key) */}
                <div className="raw">
                    <div className={ `key large ${ jump ? 'active' : '' }` }></div>
                </div>

            </div>
        </div>
    )
}
