import TextType from "./TextType";
import ElectricBorder from './ElectricBorder'
import SplashCursor from './SplashCursor'
import "./LandingPage.css";

export default function LandingPage({ onOpen }) {
  return (
    <main className="landing-page">
      <SplashCursor
        DENSITY_DISSIPATION={10}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={18}
        SPLAT_RADIUS={0.12}
        SPLAT_FORCE={9500}
        COLOR_UPDATE_SPEED={10}
        SHADING={false}
        RAINBOW_MODE={false}
        COLOR="#EF4444"
      />

      {/* Background glow */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Main content */}
      <section className="landing-content">

        <div className="protocol-label">
          <span className="status-dot"></span>
          My darling Apoorva #1
        </div>

        <h1 className="main-title">
          For you<span>.</span>
        </h1>

        <div className="terminal">

          <div className="terminal-header">
            <div className="window-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="terminal-title">
              wifey.exe
            </span>
          </div>

          <div className="terminal-content">

            <TextType
              text={[
                "[system] Initializing love_protocol...,\n[status] Loading all my favorite memories...,\n[heart] Searching for the right words...,\n[ready] One message is waiting for you."
              ]}
              typingSpeed={45}
              pauseDuration={1800}
              cursorCharacter="▎"
              cursorBlinkDuration={0.4}
              showCursor={true}
              loop={false}
            />

          </div>
          </div>
        <ElectricBorder
          color="#F43F5E"
          speed={0.50}
          chaos={0.1}
          thickness={1}
          style={{
            borderRadius: 9,
          }}
        >
          <button
            className="message-button"
            onClick={onOpen}
          >
            <span>OPEN MY MESSAGE</span>
            <span className="heart">♥</span>
          </button>
        </ElectricBorder>
        <p className="bottom-text">
          something special is waiting
        </p>

      </section>

    </main>
  );
}
