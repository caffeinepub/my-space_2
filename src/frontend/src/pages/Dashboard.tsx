import { useNavigate } from "@tanstack/react-router";
import GlassPanel from "../components/GlassPanel";
import { useAuthModal } from "../context/AuthModalContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Dashboard() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const goOrGate = (path: string) => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    navigate({ to: path });
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        textAlign: "center",
      }}
    >
      {/* Hero */}
      <div style={{ marginBottom: "3rem", maxWidth: 700 }}>
        <h1
          className="orbitron neon-cyan"
          style={{
            fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
            fontWeight: 900,
            letterSpacing: "0.08em",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          MY SPACE
        </h1>
        <p
          style={{
            color: "#A7B2C8",
            fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
            fontFamily: "Rajdhani, sans-serif",
            marginBottom: "2rem",
            fontWeight: 500,
          }}
        >
          Where Careers Are Forged & Knowledge Unlocked
        </p>
        <button
          type="button"
          className="btn-cyan"
          style={{ fontSize: "0.85rem", padding: "0.9rem 2.5rem" }}
          onClick={() => goOrGate("/cv-forge")}
          data-ocid="dashboard.get_started.primary_button"
        >
          GET STARTED →
        </button>
      </div>

      {/* Module tiles — 4 cards in a 2x2 grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
          width: "100%",
          maxWidth: 1000,
        }}
      >
        {/* CV Space */}
        <GlassPanel
          glowColor="cyan"
          style={{
            padding: "2rem",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => goOrGate("/cv-forge")}
          className="module-tile"
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📄</div>
          <h2
            className="orbitron neon-cyan"
            style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}
          >
            CV SPACE
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "0.95rem",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            Build AI-enhanced resumes with 20 templates and one-click PDF
            export.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "rgba(45,227,230,0.6)",
                fontSize: "0.78rem",
                fontFamily: "Rajdhani",
              }}
            >
              PKR 1,000 Subscription
            </span>
            <button
              type="button"
              className="btn-cyan"
              style={{ fontSize: "0.65rem", padding: "0.5rem 1.2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                goOrGate("/cv-forge");
              }}
              data-ocid="dashboard.cv_space.button"
            >
              LAUNCH →
            </button>
          </div>
        </GlassPanel>

        {/* Learning Space */}
        <GlassPanel
          glowColor="violet"
          style={{
            padding: "2rem",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => goOrGate("/oracle")}
          className="module-tile"
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🤯</div>
          <h2
            className="orbitron neon-violet"
            style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}
          >
            LEARNING SPACE
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "0.95rem",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            Step-by-step academic AI with Mermaid diagram generation.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "rgba(139,92,246,0.7)",
                fontSize: "0.78rem",
                fontFamily: "Rajdhani",
              }}
            >
              FREE • 10 Questions/Day
            </span>
            <button
              type="button"
              className="btn-violet"
              style={{ fontSize: "0.65rem", padding: "0.5rem 1.2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                goOrGate("/oracle");
              }}
              data-ocid="dashboard.learning_space.button"
            >
              ASK →
            </button>
          </div>
        </GlassPanel>

        {/* Cover Letter */}
        <GlassPanel
          glowColor="cyan"
          style={{
            padding: "2rem",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => goOrGate("/cover-letter")}
          className="module-tile"
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>✉️</div>
          <h2
            className="orbitron neon-cyan"
            style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}
          >
            COVER LETTER
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "0.95rem",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            AI-generated cover letters in 6 styles tailored to your CV profile.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "rgba(45,227,230,0.6)",
                fontSize: "0.78rem",
                fontFamily: "Rajdhani",
              }}
            >
              Formal • Creative • Tech • more
            </span>
            <button
              type="button"
              className="btn-cyan"
              style={{ fontSize: "0.65rem", padding: "0.5rem 1.2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                goOrGate("/cover-letter");
              }}
              data-ocid="dashboard.cover_letter.button"
            >
              WRITE →
            </button>
          </div>
        </GlassPanel>

        {/* Applications */}
        <GlassPanel
          glowColor="violet"
          style={{
            padding: "2rem",
            cursor: "pointer",
            transition: "transform 0.2s",
          }}
          onClick={() => goOrGate("/applications")}
          className="module-tile"
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🚀</div>
          <h2
            className="orbitron neon-violet"
            style={{ fontSize: "1.2rem", marginBottom: "0.6rem" }}
          >
            APPLICATIONS
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "0.95rem",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            7 tools: Resume Tailor, LinkedIn Summary, Cold Email, Interview Prep
            & more.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span
              style={{
                color: "rgba(139,92,246,0.7)",
                fontSize: "0.78rem",
                fontFamily: "Rajdhani",
              }}
            >
              7 Professional Tools
            </span>
            <button
              type="button"
              className="btn-violet"
              style={{ fontSize: "0.65rem", padding: "0.5rem 1.2rem" }}
              onClick={(e) => {
                e.stopPropagation();
                goOrGate("/applications");
              }}
              data-ocid="dashboard.applications.button"
            >
              EXPLORE →
            </button>
          </div>
        </GlassPanel>
      </div>

      <footer
        style={{
          textAlign: "center",
          marginTop: "3rem",
          paddingBottom: "2rem",
          color: "rgba(167,178,200,0.4)",
          fontFamily: "Rajdhani",
          fontSize: "0.8rem",
        }}
      >
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "rgba(45,227,230,0.5)", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
