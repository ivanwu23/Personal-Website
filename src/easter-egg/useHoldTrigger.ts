import { useCallback, useEffect, useRef } from 'react'
import type { PointerEvent, MouseEvent } from 'react'

type HoldTriggerOptions = {
  /** How long the press has to last, in milliseconds. */
  duration: number
  /** Called the moment the press starts (still inside the user gesture). */
  onPressStart?: () => void
  /** Called once the press has been held for `duration`. */
  onHold: () => void
}

// Press-and-hold detection, spread onto the element as event handlers.
// Letting go early (or the browser taking the pointer away, e.g. for a
// scroll) cancels it.
//
// The pointer is captured on press so the hold survives the pointer
// slipping off the element — the Home stars drift away from the cursor
// (see STAR_DRIFT_X/Y in Home.tsx), so without capture the star could
// slide out from under a perfectly still press and cancel it.
export function useHoldTrigger({ duration, onPressStart, onHold }: HoldTriggerOptions) {
  const timerRef = useRef(0)

  const cancel = useCallback(() => {
    window.clearTimeout(timerRef.current)
    timerRef.current = 0
  }, [])

  useEffect(() => cancel, [cancel])

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return
      // Stops the press from also starting a text selection or drag.
      event.preventDefault()
      event.currentTarget.setPointerCapture(event.pointerId)
      onPressStart?.()
      cancel()
      timerRef.current = window.setTimeout(() => {
        timerRef.current = 0
        onHold()
      }, duration)
    },
    onPointerUp: cancel,
    onPointerCancel: cancel,
    onLostPointerCapture: cancel,
    // A long-press on touch screens otherwise opens the context menu.
    onContextMenu(event: MouseEvent<HTMLElement>) {
      event.preventDefault()
    },
  }
}
