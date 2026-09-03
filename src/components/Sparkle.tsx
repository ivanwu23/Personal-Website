// A small four-lobed star/blob — every point (tips and inner waists)
// is drawn with matched, opposing curve handles so the outline has no
// sharp corners anywhere, not just smooth sides between pointed tips.
export default function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        d="M12,2
           C16,2 13.06,5.28 15.89,8.11
           C18.72,10.94 22,8 22,12
           C23,16 18.72,13.06 15.89,15.89
           C13.06,18.72 16,22 12,22
           C8,23 10.94,18.72 8.11,15.89
           C5.28,13.06 2,16 2,12
           C1,8 5.28,10.94 8.11,8.11
           C10.94,5.28 8,2 12,2 Z"
      />
    </svg>
  )
}
