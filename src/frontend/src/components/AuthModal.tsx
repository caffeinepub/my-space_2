import { useEffect } from "react";
import { useAuthModal } from "../context/AuthModalContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AuthModal() {
  const { isOpen, closeModal, activeTab, setActiveTab } = useAuthModal();
  const { login, loginStatus, isLoginSuccess } = useInternetIdentity();

  const isLoggingIn = loginStatus === "logging-in";

  // Auto-close when login succeeds
  useEffect(() => {
    if (isLoginSuccess) {
      closeModal();
    }
  }, [isLoginSuccess, closeModal]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      data-ocid="auth.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(7,10,20,0.82)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        animation: "fadeIn 0.15s ease",
        padding: "1rem",
      }}
    >
      {/* Invisible backdrop button to close on click outside */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={closeModal}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          border: "none",
          cursor: "default",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Modal panel */}
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          background: "rgba(18,24,38,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 20,
          padding: "2rem 2.25rem 2.5rem",
          position: "relative",
          zIndex: 1,
          animation: "fadeInScale 0.2s ease",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.55), 0 0 60px rgba(45,227,230,0.06)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeModal}
          data-ocid="auth.modal.close_button"
          style={{
            position: "absolute",
            top: 16,
            right: 18,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#A7B2C8",
            borderRadius: 8,
            width: 30,
            height: 30,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.95rem",
            lineHeight: 1,
            transition: "all 0.2s",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: "2rem",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 50,
            padding: 4,
          }}
        >
          <button
            type="button"
            data-ocid="auth.login.tab"
            onClick={() => setActiveTab("login")}
            style={{
              flex: 1,
              padding: "0.55rem 1rem",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              fontWeight: 700,
              transition: "all 0.2s",
              background:
                activeTab === "login" ? "rgba(45,227,230,0.15)" : "transparent",
              color: activeTab === "login" ? "#2DE3E6" : "#A7B2C8",
              boxShadow:
                activeTab === "login"
                  ? "0 0 12px rgba(45,227,230,0.25), inset 0 0 0 1px rgba(45,227,230,0.4)"
                  : "none",
            }}
          >
            LOGIN
          </button>
          <button
            type="button"
            data-ocid="auth.signup.tab"
            onClick={() => setActiveTab("signup")}
            style={{
              flex: 1,
              padding: "0.55rem 1rem",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              fontWeight: 700,
              transition: "all 0.2s",
              background:
                activeTab === "signup"
                  ? "rgba(139,92,246,0.15)"
                  : "transparent",
              color: activeTab === "signup" ? "#8B5CF6" : "#A7B2C8",
              boxShadow:
                activeTab === "signup"
                  ? "0 0 12px rgba(139,92,246,0.25), inset 0 0 0 1px rgba(139,92,246,0.4)"
                  : "none",
            }}
          >
            SIGN UP
          </button>
        </div>

        {/* LOGIN tab */}
        {activeTab === "login" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.18s ease" }}>
            {/* Nebula glow accent */}
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(45,227,230,0.25) 0%, transparent 70%)",
                margin: "0 auto 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              🔐
            </div>
            <h2
              className="orbitron neon-cyan"
              style={{
                fontSize: "1.35rem",
                marginBottom: "0.6rem",
                letterSpacing: "0.08em",
              }}
            >
              WELCOME BACK
            </h2>
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "1rem",
                marginBottom: "2rem",
                lineHeight: 1.5,
              }}
            >
              Connect with Internet Identity to access your space
            </p>

            <button
              type="button"
              className="btn-cyan"
              data-ocid="auth.login.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              style={{
                width: "100%",
                padding: "0.9rem 1.5rem",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: "1rem",
              }}
            >
              {isLoggingIn ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(45,227,230,0.3)",
                      borderTopColor: "#2DE3E6",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  CONNECTING...
                </>
              ) : (
                "🔐 CONNECT WITH INTERNET IDENTITY"
              )}
            </button>

            <p
              style={{
                color: "rgba(167,178,200,0.55)",
                fontSize: "0.8rem",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Secure, decentralized login on ICP
            </p>
          </div>
        )}

        {/* SIGN UP tab */}
        {activeTab === "signup" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.18s ease" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
                margin: "0 auto 1.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.8rem",
              }}
            >
              🚀
            </div>
            <h2
              className="orbitron neon-violet"
              style={{
                fontSize: "1.3rem",
                marginBottom: "0.6rem",
                letterSpacing: "0.06em",
              }}
            >
              CREATE YOUR SPACE
            </h2>
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                lineHeight: 1.5,
              }}
            >
              Join My Space — no password needed, just your Internet Identity
            </p>

            {/* Feature list */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                padding: "1rem 1.25rem",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              {(
                [
                  ["✦", "CV Space", "2 free builds", "cyan"],
                  ["✦", "Learning Space", "10 free Q&A/day", "violet"],
                  ["✦", "Celestial Profile", "Decentralized identity", "cyan"],
                ] as const
              ).map(([icon, label, desc, color]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginBottom: 10,
                    fontFamily: "Rajdhani, sans-serif",
                  }}
                >
                  <span
                    style={{
                      color: color === "cyan" ? "#2DE3E6" : "#8B5CF6",
                      fontWeight: 700,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <span
                      style={{
                        color: "#EAF2FF",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        color: "rgba(167,178,200,0.65)",
                        fontSize: "0.85rem",
                        marginLeft: 6,
                      }}
                    >
                      — {desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="btn-violet"
              data-ocid="auth.signup.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              style={{
                width: "100%",
                padding: "0.9rem 1.5rem",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: "1rem",
              }}
            >
              {isLoggingIn ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(139,92,246,0.3)",
                      borderTopColor: "#8B5CF6",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  CREATING...
                </>
              ) : (
                "🚀 CREATE INTERNET IDENTITY"
              )}
            </button>

            <p
              style={{
                color: "rgba(167,178,200,0.55)",
                fontSize: "0.8rem",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.04em",
              }}
            >
              Free to join • Powered by ICP
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
