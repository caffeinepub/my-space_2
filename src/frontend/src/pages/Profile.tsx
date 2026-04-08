import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function truncatePrincipal(principal: string): string {
  if (principal.length <= 20) return principal;
  return `${principal.slice(0, 10)}...${principal.slice(-5)}`;
}

export default function Profile() {
  const { actor } = useActor();
  const { login, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = identity?.getPrincipal().toString() ?? "";

  const [subscriptionActive, setSubscriptionActive] = useState<boolean | null>(
    null,
  );
  const [checkingSubscription, setCheckingSubscription] = useState(true);

  useEffect(() => {
    if (!actor || !isAuthenticated) {
      setCheckingSubscription(false);
      return;
    }
    actor
      .isCVForgeUnlocked()
      .then((unlocked) => setSubscriptionActive(unlocked))
      .catch(() => setSubscriptionActive(false))
      .finally(() => setCheckingSubscription(false));
  }, [actor, isAuthenticated]);

  const copyPrincipal = () => {
    navigator.clipboard.writeText(principal).then(() => {
      toast.success("Principal copied!");
    });
  };

  const copyJazzCash = () => {
    navigator.clipboard.writeText("03003257502").then(() => {
      toast.success("Copied!");
    });
  };

  const steps = [
    "Send payment via JazzCash to the account above",
    "Take a screenshot of your payment confirmation",
    "Contact us with the screenshot for manual activation",
  ];

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "2rem 1rem",
        minHeight: "calc(100vh - 80px)",
      }}
    >
      <h1
        className="orbitron neon-cyan"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2rem)",
          marginBottom: "2rem",
          textAlign: "center",
          letterSpacing: "0.15em",
        }}
        data-ocid="profile.page"
      >
        MY PROFILE
      </h1>

      {!isAuthenticated ? (
        <GlassPanel
          glowColor="cyan"
          style={{ padding: "3rem 2rem", textAlign: "center" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👤</div>
          <h2
            className="orbitron"
            style={{
              fontSize: "1.1rem",
              color: "#EAF2FF",
              marginBottom: "0.75rem",
            }}
          >
            NOT LOGGED IN
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "1rem",
              marginBottom: "2rem",
            }}
          >
            Login with Internet Identity to view your profile and subscription
            status.
          </p>
          <button
            type="button"
            className="btn-cyan"
            style={{ padding: "0.9rem 2.5rem", fontSize: "0.8rem" }}
            onClick={login}
            data-ocid="profile.login.button"
          >
            LOGIN →
          </button>
        </GlassPanel>
      ) : (
        <GlassPanel glowColor="cyan" style={{ padding: "2rem" }}>
          {/* ACCOUNT SECTION */}
          <section style={{ marginBottom: "2rem" }}>
            <h2
              className="orbitron"
              style={{
                fontSize: "0.75rem",
                color: "rgba(167,178,200,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "1rem",
                borderBottom: "1px solid rgba(45,227,230,0.15)",
                paddingBottom: "0.5rem",
              }}
            >
              ACCOUNT
            </h2>

            <div style={{ marginBottom: "0.75rem" }}>
              <span
                style={{
                  display: "inline-block",
                  background: "rgba(45,227,230,0.12)",
                  border: "1px solid rgba(45,227,230,0.35)",
                  borderRadius: 50,
                  padding: "3px 14px",
                  color: "#2DE3E6",
                  fontSize: "0.72rem",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                Internet Identity
              </span>
            </div>

            <div>
              <p
                style={{
                  color: "rgba(167,178,200,0.6)",
                  fontFamily: "Rajdhani",
                  fontSize: "0.8rem",
                  marginBottom: 6,
                  letterSpacing: "0.05em",
                }}
              >
                PRINCIPAL ID
              </p>
              <button
                type="button"
                onClick={copyPrincipal}
                title="Click to copy full Principal ID"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                }}
                data-ocid="profile.principal.copy_button"
              >
                <span
                  className="orbitron"
                  style={{
                    color: "#EAF2FF",
                    fontSize: "0.85rem",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {truncatePrincipal(principal)}
                </span>
                <span
                  style={{
                    color: "rgba(45,227,230,0.5)",
                    fontSize: "0.7rem",
                    fontFamily: "Rajdhani",
                    flexShrink: 0,
                  }}
                >
                  📋 Copy
                </span>
              </button>
            </div>
          </section>

          {/* SUBSCRIPTION SECTION */}
          <section>
            <h2
              className="orbitron"
              style={{
                fontSize: "0.75rem",
                color: "rgba(167,178,200,0.6)",
                letterSpacing: "0.2em",
                marginBottom: "1rem",
                borderBottom: "1px solid rgba(45,227,230,0.15)",
                paddingBottom: "0.5rem",
              }}
            >
              SUBSCRIPTION STATUS
            </h2>

            {checkingSubscription ? (
              <div
                className="neon-cyan orbitron"
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.15em",
                  opacity: 0.6,
                }}
                data-ocid="profile.subscription.loading_state"
              >
                CHECKING...
              </div>
            ) : subscriptionActive ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: 10 }}
                data-ocid="profile.subscription.success_state"
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(34,197,94,0.12)",
                    border: "1px solid rgba(34,197,94,0.35)",
                    borderRadius: 50,
                    padding: "5px 18px",
                    color: "#4ade80",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                  }}
                >
                  ✓ ACTIVE — Full Access
                </span>
              </div>
            ) : (
              <div data-ocid="profile.subscription.error_state">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(239,68,68,0.12)",
                      border: "1px solid rgba(239,68,68,0.35)",
                      borderRadius: 50,
                      padding: "5px 18px",
                      color: "#f87171",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "0.75rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ✗ INACTIVE
                  </span>
                </div>

                {/* JazzCash payment info */}
                <div
                  style={{
                    background: "rgba(45,227,230,0.04)",
                    border: "1px solid rgba(45,227,230,0.25)",
                    borderRadius: 14,
                    padding: "1.5rem",
                    marginBottom: "1rem",
                  }}
                  data-ocid="profile.jazzcash.panel"
                >
                  <h3
                    className="orbitron neon-cyan"
                    style={{
                      fontSize: "0.95rem",
                      marginBottom: "1.25rem",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Subscribe for PKR 1,000
                  </h3>

                  <p
                    style={{
                      color: "#A7B2C8",
                      fontFamily: "Rajdhani",
                      fontSize: "0.9rem",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Send PKR 1,000 to the following JazzCash account:
                  </p>

                  <button
                    type="button"
                    onClick={copyJazzCash}
                    title="Click to copy"
                    style={{
                      display: "block",
                      width: "100%",
                      background: "rgba(45,227,230,0.08)",
                      border: "1px solid rgba(45,227,230,0.4)",
                      borderRadius: 10,
                      padding: "0.9rem",
                      cursor: "pointer",
                      textAlign: "center",
                      marginBottom: "0.5rem",
                    }}
                    data-ocid="profile.jazzcash.copy_button"
                  >
                    <span
                      className="orbitron"
                      style={{
                        fontSize: "1.4rem",
                        color: "#2DE3E6",
                        letterSpacing: "0.12em",
                        textShadow:
                          "0 0 14px rgba(45,227,230,0.7), 0 0 30px rgba(45,227,230,0.3)",
                        display: "block",
                      }}
                    >
                      03003257502
                    </span>
                    <span
                      style={{
                        color: "rgba(45,227,230,0.5)",
                        fontSize: "0.68rem",
                        fontFamily: "Rajdhani",
                        marginTop: 3,
                        display: "block",
                      }}
                    >
                      📋 Click to copy
                    </span>
                  </button>

                  <p
                    style={{
                      color: "rgba(167,178,200,0.7)",
                      fontFamily: "Rajdhani",
                      fontSize: "0.82rem",
                      textAlign: "center",
                      marginBottom: "1.25rem",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Account Name: MY SPACE SUBSCRIPTION
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginBottom: "1rem",
                    }}
                  >
                    {steps.map((s, i) => (
                      <div
                        key={s}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            background: "rgba(45,227,230,0.15)",
                            border: "1px solid rgba(45,227,230,0.3)",
                            borderRadius: "50%",
                            width: 22,
                            height: 22,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#2DE3E6",
                            fontFamily: "Orbitron, sans-serif",
                            fontSize: "0.62rem",
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </span>
                        <span
                          style={{
                            color: "#A7B2C8",
                            fontFamily: "Rajdhani",
                            fontSize: "0.88rem",
                            paddingTop: 2,
                          }}
                        >
                          {s}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p
                    style={{
                      color: "rgba(167,178,200,0.45)",
                      fontFamily: "Rajdhani",
                      fontSize: "0.78rem",
                      fontStyle: "italic",
                      borderTop: "1px solid rgba(45,227,230,0.1)",
                      paddingTop: "0.75rem",
                      textAlign: "center",
                    }}
                  >
                    Access activated within 24 hours after payment confirmation.
                  </p>
                </div>

                <button
                  type="button"
                  className="btn-cyan"
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    fontSize: "0.75rem",
                  }}
                  onClick={() => navigate({ to: "/cv-forge" })}
                  data-ocid="profile.card.button"
                >
                  💳 PAY VIA CARD →
                </button>
              </div>
            )}
          </section>
        </GlassPanel>
      )}

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
