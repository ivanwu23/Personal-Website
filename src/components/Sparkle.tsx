// A four-pointed sparkle. Each of the four sides is one cubic Bézier from
// tip to tip, and every control point is the 90°-rotation of the last, so
// the four points are identical and the tips read as gently rounded rather
// than sharp.
export default function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12,3
           C13.4,6 18,10.6 21,12
           C18,13.4 13.4,18 12,21
           C10.6,18 6,13.4 3,12
           C6,10.6 10.6,6 12,3 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}
