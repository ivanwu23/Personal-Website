import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Loading">
      <div className="loading-bars" aria-hidden="true">
        <span className="loading-bar" />
        <span className="loading-bar" />
        <span className="loading-bar" />
      </div>
    </div>
  )
}
