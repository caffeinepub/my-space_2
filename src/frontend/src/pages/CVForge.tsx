import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CVTemplates,
  FREE_TEMPLATE_INDICES,
  templateNames,
} from "../components/CVTemplates";
import type { CVData } from "../components/CVTemplates";
import GlassPanel from "../components/GlassPanel";
import { useAuthModal } from "../context/AuthModalContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

// Internal tracking constant — NEVER displayed to users
const _PAYMENT_DEST = "03003257502";
void _PAYMENT_DEST;

const emptyCV: CVData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  linkedin: "",
  github: "",
  website: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
};

function parseGeminiText(raw: string): string {
  let text = raw;
  try {
    text = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text ?? raw;
  } catch {}
  return text.trim();
}

export default function CVForge() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingLock, setCheckingLock] = useState(true);
  const [step, setStep] = useState(0);
  const [cvData, setCVData] = useState<CVData>(emptyCV);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [showJazzCash, setShowJazzCash] = useState(false);

  // Job description suggestion state
  const [jobDescLoading, setJobDescLoading] = useState<number | null>(null);
  const [jobDescSuggestions, setJobDescSuggestions] = useState<{
    expIdx: number;
    bullets: string[];
  } | null>(null);

  // Free save tracking
  const [saveCount, setSaveCount] = useState(() =>
    Number.parseInt(localStorage.getItem("cv_save_count") || "0", 10),
  );
  const [showChargeDialog, setShowChargeDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Login gate — show before anything else
  if (!isAuthenticated && actor && !checkingLock) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          padding: "2rem",
        }}
      >
        <GlassPanel
          glowColor="cyan"
          style={{
            maxWidth: 460,
            width: "100%",
            padding: "3rem 2.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h2
            className="orbitron neon-cyan"
            style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}
          >
            LOGIN REQUIRED
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              fontSize: "1.05rem",
              marginBottom: "2rem",
              lineHeight: 1.5,
            }}
          >
            Sign in with Internet Identity to access CV Space and build your
            professional resume.
          </p>
          <button
            type="button"
            className="btn-cyan"
            style={{ width: "100%", padding: "0.9rem", fontSize: "0.8rem" }}
            onClick={() => openModal("login")}
            data-ocid="cv.login.primary_button"
          >
            🔐 LOGIN TO CONTINUE
          </button>
        </GlassPanel>
      </div>
    );
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: hooks are called at top level; this return is safe
  useEffect(() => {
    if (!actor) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const success = params.get("success");
    const canceled = params.get("canceled");
    if (canceled === "true") toast.error("Payment was canceled.");

    const init = async () => {
      try {
        if (success === "true" && sessionId) {
          const unlocked = await actor.verifyCVPayment(sessionId);
          if (unlocked) {
            toast.success("CV Forge unlocked!");
            setIsUnlocked(true);
          } else {
            toast.error("Payment verification failed.");
          }
        } else {
          const unlocked = await actor.isCVForgeUnlocked();
          setIsUnlocked(unlocked);
        }
        const profileOpt = await actor.getCVProfile();
        if (profileOpt && profileOpt.__kind__ === "Some") {
          setCVData(profileOpt.value as CVData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingLock(false);
      }
    };
    init();
  }, [actor]);

  const handleUnlock = async () => {
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    try {
      const base = window.location.href.split("?")[0];
      const raw = await actor.createCVCheckout(
        `${base}?success=true`,
        `${base}?canceled=true`,
      );
      let url = raw;
      try {
        const parsed = JSON.parse(raw);
        url = parsed?.url ?? raw;
      } catch {}
      window.location.href = url;
    } catch {
      toast.error("Failed to create checkout. Try again.");
    }
  };

  const copyJazzCash = () => {
    navigator.clipboard.writeText("03003257502").then(() => {
      toast.success("Copied!");
    });
  };

  const enhanceBullet = async (expIdx: number, bulletIdx: number) => {
    if (!actor) return;
    const key = `${expIdx}-${bulletIdx}`;
    setEnhancing(key);
    try {
      const raw = cvData.experience[expIdx].bullets[bulletIdx];
      const responseRaw = await actor.enhanceCVText(raw);
      const text = parseGeminiText(responseRaw);
      const newExp = cvData.experience.map((e, ei) =>
        ei === expIdx
          ? {
              ...e,
              bullets: e.bullets.map((b, bi) => (bi === bulletIdx ? text : b)),
            }
          : e,
      );
      setCVData({ ...cvData, experience: newExp });
      toast.success("Enhanced!");
    } catch {
      toast.error("Enhancement failed");
    } finally {
      setEnhancing(null);
    }
  };

  // Auto job description on blur
  const fetchJobDescription = async (expIdx: number, title: string) => {
    if (!actor || !title.trim()) return;
    setJobDescLoading(expIdx);
    try {
      const raw = await (actor as any).getJobDescription(title.trim());
      const text = parseGeminiText(raw);
      // Parse bullet lines from the response
      const lines = text
        .split("\n")
        .map((l) => l.replace(/^[\-\*\u2022\d\.]+\s*/, "").trim())
        .filter((l) => l.length > 10);
      if (lines.length > 0) {
        setJobDescSuggestions({ expIdx, bullets: lines.slice(0, 6) });
      }
    } catch {
      // Silently skip
    } finally {
      setJobDescLoading(null);
    }
  };

  const applyJobSuggestions = (
    expIdx: number,
    bullets: string[],
    addToExisting: boolean,
  ) => {
    setCVData((d) => ({
      ...d,
      experience: d.experience.map((e, i) =>
        i === expIdx
          ? {
              ...e,
              bullets: addToExisting
                ? [...e.bullets.filter(Boolean), ...bullets]
                : bullets,
            }
          : e,
      ),
    }));
    setJobDescSuggestions(null);
    toast.success("Suggestions applied!");
  };

  const updateExp = (ei: number, field: string, val: string) => {
    setCVData((d) => ({
      ...d,
      experience: d.experience.map((e, i) =>
        i === ei ? { ...e, [field]: val } : e,
      ),
    }));
  };
  const updateEdu = (ei: number, field: string, val: string) => {
    setCVData((d) => ({
      ...d,
      education: d.education.map((e, i) =>
        i === ei ? { ...e, [field]: val } : e,
      ),
    }));
  };
  const updateProj = (pi: number, field: string, val: string) => {
    setCVData((d) => ({
      ...d,
      projects: d.projects.map((p, i) =>
        i === pi ? { ...p, [field]: val } : p,
      ),
    }));
  };
  const updateBullet = (ei: number, bi: number, val: string) => {
    setCVData((d) => ({
      ...d,
      experience: d.experience.map((e, i) =>
        i === ei
          ? { ...e, bullets: e.bullets.map((b, j) => (j === bi ? val : b)) }
          : e,
      ),
    }));
  };

  const performSave = async () => {
    if (!actor) return;
    setSaving(true);
    try {
      await actor.saveCVProfile(
        cvData as Parameters<typeof actor.saveCVProfile>[0],
      );
      const newCount = saveCount + 1;
      setSaveCount(newCount);
      localStorage.setItem("cv_save_count", String(newCount));
      if (newCount <= 2) {
        toast.success(`CV saved! (${newCount} of 2 free saves used)`);
      } else {
        toast.success("CV saved!");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const saveCV = () => {
    if (saveCount < 2) {
      performSave();
    } else {
      setShowChargeDialog(true);
    }
  };

  const handleConfirmCharge = async () => {
    setShowChargeDialog(false);
    await performSave();
  };

  const exportPDF = () => {
    window.print();
  };

  if (!actor || checkingLock) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
        }}
      >
        <div
          className="neon-cyan orbitron"
          style={{
            fontSize: "1rem",
            letterSpacing: "0.2em",
            animation: "pulse-glow 1.5s infinite",
          }}
        >
          INITIALIZING...
        </div>
      </div>
    );
  }

  // PAYWALL
  if (!isUnlocked) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 80px)",
          padding: "2rem",
        }}
      >
        <GlassPanel
          glowColor="cyan"
          style={{
            maxWidth: 520,
            width: "100%",
            padding: "3rem 2.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔒</div>
          <h2
            className="orbitron neon-cyan"
            style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}
          >
            CV SPACE
          </h2>
          <p
            style={{
              color: "#A7B2C8",
              marginBottom: "0.5rem",
              fontFamily: "Rajdhani",
              fontSize: "1.1rem",
            }}
          >
            Unlock AI-enhanced resume building with 20 templates and PDF export.
          </p>
          <p
            style={{
              color: "rgba(167,178,200,0.6)",
              marginBottom: "2rem",
              fontSize: "0.9rem",
              fontFamily: "Rajdhani",
            }}
          >
            Subscription • Full Access
          </p>
          <div
            style={{
              fontSize: "3rem",
              fontFamily: "Orbitron, sans-serif",
              color: "#2DE3E6",
              marginBottom: "2rem",
              textShadow: "0 0 20px rgba(45,227,230,0.4)",
            }}
          >
            PKR 1,000
          </div>

          <div
            style={{
              background: "rgba(45,227,230,0.05)",
              border: "1px solid rgba(45,227,230,0.2)",
              borderRadius: 14,
              padding: "1.25rem 1.5rem",
              marginBottom: "1.25rem",
              textAlign: "left",
            }}
          >
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani",
                fontSize: "0.95rem",
                marginBottom: "1rem",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "#2DE3E6", fontWeight: 700 }}>
                ✦ Try free first:
              </span>{" "}
              Build and save your CV up to 2 times at no charge. Additional
              saves are PKR 500 each.
            </p>
            <button
              type="button"
              className="btn-cyan"
              style={{ width: "100%", padding: "0.8rem", fontSize: "0.72rem" }}
              onClick={() => setIsUnlocked(true)}
              data-ocid="paywall.try_free.button"
            >
              ✨ TRY FREE — 2 SAVES INCLUDED
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginBottom: showJazzCash ? "1.5rem" : 0,
            }}
          >
            <button
              type="button"
              className="btn-cyan"
              style={{ flex: 1, padding: "0.9rem", fontSize: "0.75rem" }}
              onClick={handleUnlock}
              data-ocid="paywall.card.button"
            >
              💳 PAY VIA CARD
            </button>
            <button
              type="button"
              className={showJazzCash ? "btn-violet" : "btn-cyan"}
              style={{ flex: 1, padding: "0.9rem", fontSize: "0.75rem" }}
              onClick={() => setShowJazzCash((v) => !v)}
              data-ocid="paywall.jazzcash.toggle"
            >
              📱 PAY VIA JAZZCASH
            </button>
          </div>

          {showJazzCash && (
            <div
              style={{
                background: "rgba(45,227,230,0.04)",
                border: "1px solid rgba(45,227,230,0.3)",
                borderRadius: 14,
                padding: "1.75rem 1.5rem",
                textAlign: "left",
              }}
              data-ocid="paywall.jazzcash.panel"
            >
              <h3
                className="orbitron neon-cyan"
                style={{
                  fontSize: "1rem",
                  marginBottom: "1.25rem",
                  textAlign: "center",
                  letterSpacing: "0.1em",
                }}
              >
                JazzCash Payment
              </h3>
              <div style={{ marginBottom: "1.2rem" }}>
                <p
                  style={{
                    color: "#A7B2C8",
                    fontFamily: "Rajdhani",
                    fontSize: "0.95rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "#2DE3E6",
                      fontWeight: 700,
                      marginRight: 6,
                    }}
                  >
                    Step 1:
                  </span>
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
                    border: "1px solid rgba(45,227,230,0.5)",
                    borderRadius: 10,
                    padding: "1rem",
                    cursor: "pointer",
                    textAlign: "center",
                    marginBottom: "0.5rem",
                  }}
                  data-ocid="paywall.jazzcash.copy_button"
                >
                  <span
                    className="orbitron"
                    style={{
                      fontSize: "1.6rem",
                      color: "#2DE3E6",
                      letterSpacing: "0.14em",
                      textShadow: "0 0 16px rgba(45,227,230,0.7)",
                      display: "block",
                    }}
                  >
                    03003257502
                  </span>
                  <span
                    style={{
                      color: "rgba(45,227,230,0.5)",
                      fontSize: "0.7rem",
                      fontFamily: "Rajdhani",
                      marginTop: 4,
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
                    fontSize: "0.85rem",
                    textAlign: "center",
                    letterSpacing: "0.08em",
                  }}
                >
                  Account Name: MY SPACE SUBSCRIPTION
                </p>
              </div>
              <p
                style={{
                  color: "#A7B2C8",
                  fontFamily: "Rajdhani",
                  fontSize: "0.95rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span
                  style={{ color: "#2DE3E6", fontWeight: 700, marginRight: 6 }}
                >
                  Step 2:
                </span>
                Take a screenshot of your payment confirmation.
              </p>
              <p
                style={{
                  color: "#A7B2C8",
                  fontFamily: "Rajdhani",
                  fontSize: "0.95rem",
                  marginBottom: "1.25rem",
                }}
              >
                <span
                  style={{ color: "#2DE3E6", fontWeight: 700, marginRight: 6 }}
                >
                  Step 3:
                </span>
                Send the screenshot to us for manual verification.
              </p>
              <p
                style={{
                  color: "rgba(167,178,200,0.5)",
                  fontFamily: "Rajdhani",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  borderTop: "1px solid rgba(45,227,230,0.1)",
                  paddingTop: "0.9rem",
                  textAlign: "center",
                }}
              >
                Your access will be activated within 24 hours after payment
                confirmation.
              </p>
            </div>
          )}
        </GlassPanel>
      </div>
    );
  }

  const steps = [
    "Personal",
    "Experience",
    "Education",
    "Skills",
    "Projects",
    "Preview",
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Service Charge Confirmation Dialog */}
      {showChargeDialog && (
        <div
          data-ocid="cv.charge.dialog"
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
          <div
            style={{
              maxWidth: 400,
              width: "100%",
              background: "rgba(18,24,38,0.85)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(139,92,246,0.3)",
              borderRadius: 20,
              padding: "2rem 2rem 2.25rem",
              textAlign: "center",
              animation: "fadeInScale 0.2s ease",
              boxShadow:
                "0 8px 40px rgba(0,0,0,0.55), 0 0 60px rgba(139,92,246,0.07)",
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>💰</div>
            <h3
              className="orbitron neon-violet"
              style={{
                fontSize: "1.1rem",
                marginBottom: "0.75rem",
                letterSpacing: "0.06em",
              }}
            >
              SERVICE CHARGE REQUIRED
            </h3>
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                marginBottom: "1.25rem",
              }}
            >
              You've used your 2 free CV saves. A service charge applies for
              each additional save.
            </p>
            <div
              style={{
                fontSize: "2.5rem",
                fontFamily: "Orbitron, sans-serif",
                color: "#2DE3E6",
                textShadow: "0 0 20px rgba(45,227,230,0.4)",
                marginBottom: "0.35rem",
                letterSpacing: "0.04em",
              }}
            >
              PKR 500
            </div>
            <p
              style={{
                color: "rgba(167,178,200,0.5)",
                fontFamily: "Rajdhani",
                fontSize: "0.8rem",
                marginBottom: "1.75rem",
              }}
            >
              per additional save
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                className="btn-violet"
                style={{ flex: 1, padding: "0.75rem", fontSize: "0.68rem" }}
                onClick={() => setShowChargeDialog(false)}
                data-ocid="cv.charge.cancel_button"
              >
                ✗ CANCEL
              </button>
              <button
                type="button"
                className="btn-cyan"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  fontSize: "0.68rem",
                  opacity: saving ? 0.6 : 1,
                }}
                onClick={handleConfirmCharge}
                disabled={saving}
                data-ocid="cv.charge.confirm_button"
              >
                {saving ? "SAVING..." : "✓ CONFIRM & SAVE"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Description Suggestions Panel */}
      {jobDescSuggestions && (
        <div
          data-ocid="cv.jobdesc.dialog"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(7,10,20,0.75)",
            backdropFilter: "blur(6px)",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: 520,
              width: "100%",
              background: "rgba(18,24,38,0.9)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(45,227,230,0.3)",
              borderRadius: 20,
              padding: "2rem",
              animation: "fadeInScale 0.2s ease",
            }}
          >
            <h3
              className="orbitron neon-cyan"
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                letterSpacing: "0.08em",
              }}
            >
              ✨ SUGGESTED BULLETS
            </h3>
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani",
                fontSize: "0.9rem",
                marginBottom: "1.25rem",
              }}
            >
              AI-generated bullet points for this role. Select to add:
            </p>
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {jobDescSuggestions.bullets.map((b, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: bullet suggestions are transient
                  key={i}
                  style={{
                    background: "rgba(45,227,230,0.05)",
                    border: "1px solid rgba(45,227,230,0.2)",
                    borderRadius: 8,
                    padding: "0.6rem 0.9rem",
                    color: "#EAF2FF",
                    fontFamily: "Rajdhani",
                    fontSize: "0.95rem",
                    lineHeight: 1.5,
                  }}
                >
                  • {b}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn-cyan"
                style={{ flex: 1, padding: "0.65rem", fontSize: "0.65rem" }}
                onClick={() =>
                  applyJobSuggestions(
                    jobDescSuggestions.expIdx,
                    jobDescSuggestions.bullets,
                    false,
                  )
                }
                data-ocid="cv.jobdesc.use_button"
              >
                USE SUGGESTIONS
              </button>
              {cvData.experience[jobDescSuggestions.expIdx]?.bullets.some(
                Boolean,
              ) && (
                <button
                  type="button"
                  className="btn-violet"
                  style={{ flex: 1, padding: "0.65rem", fontSize: "0.65rem" }}
                  onClick={() =>
                    applyJobSuggestions(
                      jobDescSuggestions.expIdx,
                      jobDescSuggestions.bullets,
                      true,
                    )
                  }
                  data-ocid="cv.jobdesc.add_button"
                >
                  ADD TO EXISTING
                </button>
              )}
              <button
                type="button"
                onClick={() => setJobDescSuggestions(null)}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#A7B2C8",
                  borderRadius: 50,
                  padding: "0.65rem 1.2rem",
                  cursor: "pointer",
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "0.65rem",
                }}
                data-ocid="cv.jobdesc.close_button"
              >
                DISMISS
              </button>
            </div>
          </div>
        </div>
      )}

      <h1
        className="orbitron neon-cyan"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        CV SPACE
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#A7B2C8",
          marginBottom: "2rem",
          fontFamily: "Rajdhani",
          fontSize: "1.1rem",
        }}
      >
        Build your professional CV with AI-powered enhancements
      </p>

      {/* Step tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: "1.5rem",
          overflowX: "auto",
          paddingBottom: 4,
        }}
      >
        {steps.map((s, i) => (
          <button
            type="button"
            key={s}
            onClick={() => setStep(i)}
            style={{
              padding: "7px 14px",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: step === i ? "#2DE3E6" : "rgba(255,255,255,0.06)",
              color: step === i ? "#070A14" : "#A7B2C8",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.62rem",
              letterSpacing: "0.06em",
              fontWeight: 700,
              transition: "all 0.2s",
            }}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>

      <GlassPanel style={{ padding: "2rem" }}>
        {/* Step 0: Personal */}
        {step === 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            {(
              [
                "name",
                "email",
                "phone",
                "location",
                "linkedin",
                "github",
                "website",
              ] as const
            ).map((field) => (
              <div
                key={field}
                style={field === "name" ? { gridColumn: "1 / -1" } : {}}
              >
                <label
                  htmlFor={`personal-${field}`}
                  style={{
                    display: "block",
                    color: "#A7B2C8",
                    fontSize: "0.8rem",
                    marginBottom: 4,
                    textTransform: "capitalize",
                  }}
                >
                  {field}
                </label>
                <input
                  id={`personal-${field}`}
                  className="glass-input"
                  value={cvData[field]}
                  onChange={(e) =>
                    setCVData({ ...cvData, [field]: e.target.value })
                  }
                  placeholder={field}
                  data-ocid={`cv.personal.${field}.input`}
                />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                htmlFor="personal-summary"
                style={{
                  display: "block",
                  color: "#A7B2C8",
                  fontSize: "0.8rem",
                  marginBottom: 4,
                }}
              >
                Professional Summary
              </label>
              <textarea
                id="personal-summary"
                className="glass-input"
                rows={4}
                value={cvData.summary}
                onChange={(e) =>
                  setCVData({ ...cvData, summary: e.target.value })
                }
                placeholder="A brief professional summary..."
                style={{ resize: "vertical" }}
                data-ocid="cv.personal.summary.textarea"
              />
            </div>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div>
            {cvData.experience.map((exp, ei) => (
              <GlassPanel
                // biome-ignore lint/suspicious/noArrayIndexKey: stable order list
                key={`exp-${ei}`}
                style={{
                  padding: "1.5rem",
                  marginBottom: "1rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setCVData((d) => ({
                      ...d,
                      experience: d.experience.filter((_, i) => i !== ei),
                    }))
                  }
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#f87171",
                    borderRadius: 6,
                    padding: "2px 10px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Remove
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                  }}
                >
                  {(["title", "company", "startDate", "endDate"] as const).map(
                    (f) => (
                      <div key={f} style={{ position: "relative" }}>
                        <label
                          htmlFor={`exp-${ei}-${f}`}
                          style={{
                            display: "block",
                            color: "#A7B2C8",
                            fontSize: "0.75rem",
                            marginBottom: 2,
                          }}
                        >
                          {f.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <div style={{ position: "relative" }}>
                          <input
                            id={`exp-${ei}-${f}`}
                            className="glass-input"
                            style={{
                              fontSize: "0.9rem",
                              paddingRight:
                                f === "title" && jobDescLoading === ei
                                  ? "2.5rem"
                                  : undefined,
                            }}
                            value={exp[f]}
                            onChange={(e) => updateExp(ei, f, e.target.value)}
                            onBlur={
                              f === "title"
                                ? () => fetchJobDescription(ei, exp.title)
                                : undefined
                            }
                            data-ocid={`cv.exp.${f}.input`}
                          />
                          {f === "title" && jobDescLoading === ei && (
                            <span
                              style={{
                                position: "absolute",
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                display: "inline-block",
                                width: 14,
                                height: 14,
                                border: "2px solid rgba(45,227,230,0.3)",
                                borderTopColor: "#2DE3E6",
                                borderRadius: "50%",
                                animation: "spin 0.8s linear infinite",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
                {/* Job description suggestion hint */}
                {exp.title && (
                  <p
                    style={{
                      color: "rgba(45,227,230,0.5)",
                      fontFamily: "Rajdhani",
                      fontSize: "0.78rem",
                      marginBottom: 8,
                    }}
                  >
                    ✨ Leave the title field to auto-suggest bullet points
                  </p>
                )}
                <p
                  style={{
                    color: "#A7B2C8",
                    fontSize: "0.8rem",
                    marginBottom: 6,
                  }}
                >
                  Bullet Points:
                </p>
                {exp.bullets.map((b, bi) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable order list
                    key={`bullet-${ei}-${bi}`}
                    style={{
                      display: "flex",
                      gap: 8,
                      marginBottom: 8,
                      alignItems: "flex-start",
                    }}
                  >
                    <textarea
                      className="glass-input"
                      rows={2}
                      value={b}
                      onChange={(e) => updateBullet(ei, bi, e.target.value)}
                      style={{ resize: "none", flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-cyan"
                      style={{
                        padding: "6px 10px",
                        fontSize: "0.6rem",
                        whiteSpace: "nowrap",
                        opacity: enhancing === `${ei}-${bi}` ? 0.6 : 1,
                      }}
                      onClick={() => enhanceBullet(ei, bi)}
                      disabled={enhancing !== null}
                    >
                      {enhancing === `${ei}-${bi}` ? "..." : "✨ AI"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setCVData((d) => ({
                          ...d,
                          experience: d.experience.map((e, i) =>
                            i === ei
                              ? {
                                  ...e,
                                  bullets: e.bullets.filter((_, j) => j !== bi),
                                }
                              : e,
                          ),
                        }))
                      }
                      style={{
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        color: "#f87171",
                        borderRadius: 8,
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn-cyan"
                  style={{
                    padding: "5px 14px",
                    fontSize: "0.62rem",
                    marginTop: 4,
                  }}
                  onClick={() =>
                    setCVData((d) => ({
                      ...d,
                      experience: d.experience.map((e, i) =>
                        i === ei ? { ...e, bullets: [...e.bullets, ""] } : e,
                      ),
                    }))
                  }
                >
                  + Add Bullet
                </button>
              </GlassPanel>
            ))}
            <button
              type="button"
              className="btn-cyan"
              style={{ width: "100%", padding: "0.75rem" }}
              onClick={() =>
                setCVData((d) => ({
                  ...d,
                  experience: [
                    ...d.experience,
                    {
                      title: "",
                      company: "",
                      startDate: "",
                      endDate: "",
                      bullets: [""],
                    },
                  ],
                }))
              }
            >
              + Add Experience
            </button>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div>
            {cvData.education.map((edu, i) => (
              <GlassPanel
                // biome-ignore lint/suspicious/noArrayIndexKey: stable order list
                key={`edu-${i}`}
                style={{
                  padding: "1.5rem",
                  marginBottom: "1rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setCVData((d) => ({
                      ...d,
                      education: d.education.filter((_, j) => j !== i),
                    }))
                  }
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#f87171",
                    borderRadius: 6,
                    padding: "2px 10px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Remove
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {(["degree", "school", "startDate", "endDate"] as const).map(
                    (f) => (
                      <div key={f}>
                        <label
                          htmlFor={`edu-${i}-${f}`}
                          style={{
                            display: "block",
                            color: "#A7B2C8",
                            fontSize: "0.75rem",
                            marginBottom: 2,
                          }}
                        >
                          {f.replace(/([A-Z])/g, " $1").trim()}
                        </label>
                        <input
                          id={`edu-${i}-${f}`}
                          className="glass-input"
                          style={{ fontSize: "0.9rem" }}
                          value={edu[f]}
                          onChange={(e) => updateEdu(i, f, e.target.value)}
                        />
                      </div>
                    ),
                  )}
                </div>
              </GlassPanel>
            ))}
            <button
              type="button"
              className="btn-cyan"
              style={{ width: "100%", padding: "0.75rem" }}
              onClick={() =>
                setCVData((d) => ({
                  ...d,
                  education: [
                    ...d.education,
                    { degree: "", school: "", startDate: "", endDate: "" },
                  ],
                }))
              }
            >
              + Add Education
            </button>
          </div>
        )}

        {/* Step 3: Skills */}
        {step === 3 && (
          <div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: "1.5rem",
              }}
            >
              {cvData.skills.map((skill, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: stable order list
                  key={`skill-${i}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(45,227,230,0.1)",
                    border: "1px solid rgba(45,227,230,0.3)",
                    borderRadius: 50,
                    padding: "4px 14px",
                    color: "#2DE3E6",
                    fontSize: "0.9rem",
                    fontFamily: "Rajdhani",
                  }}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() =>
                      setCVData((d) => ({
                        ...d,
                        skills: d.skills.filter((_, j) => j !== i),
                      }))
                    }
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(45,227,230,0.6)",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "0.75rem",
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, maxWidth: 400 }}>
              <input
                className="glass-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Type a skill and press Enter"
                data-ocid="cv.skills.input"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && skillInput.trim()) {
                    setCVData((d) =>
                      d.skills.includes(skillInput.trim())
                        ? d
                        : { ...d, skills: [...d.skills, skillInput.trim()] },
                    );
                    setSkillInput("");
                  }
                }}
              />
              <button
                type="button"
                className="btn-cyan"
                style={{ padding: "0.6rem 1.2rem", whiteSpace: "nowrap" }}
                onClick={() => {
                  if (skillInput.trim()) {
                    setCVData((d) =>
                      d.skills.includes(skillInput.trim())
                        ? d
                        : { ...d, skills: [...d.skills, skillInput.trim()] },
                    );
                    setSkillInput("");
                  }
                }}
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Projects */}
        {step === 4 && (
          <div>
            {cvData.projects.map((proj, i) => (
              <GlassPanel
                // biome-ignore lint/suspicious/noArrayIndexKey: stable order list
                key={`proj-${i}`}
                style={{
                  padding: "1.5rem",
                  marginBottom: "1rem",
                  position: "relative",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setCVData((d) => ({
                      ...d,
                      projects: d.projects.filter((_, j) => j !== i),
                    }))
                  }
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(239,68,68,0.2)",
                    border: "1px solid rgba(239,68,68,0.4)",
                    color: "#f87171",
                    borderRadius: 6,
                    padding: "2px 10px",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                  }}
                >
                  Remove
                </button>
                {(["name", "url", "description"] as const).map((f) => (
                  <div key={f} style={{ marginBottom: "0.75rem" }}>
                    <label
                      htmlFor={`proj-${i}-${f}`}
                      style={{
                        display: "block",
                        color: "#A7B2C8",
                        fontSize: "0.75rem",
                        marginBottom: 2,
                        textTransform: "capitalize",
                      }}
                    >
                      {f}
                    </label>
                    {f === "description" ? (
                      <textarea
                        id={`proj-${i}-${f}`}
                        className="glass-input"
                        rows={3}
                        value={proj[f]}
                        onChange={(e) => updateProj(i, f, e.target.value)}
                        style={{ resize: "vertical" }}
                      />
                    ) : (
                      <input
                        id={`proj-${i}-${f}`}
                        className="glass-input"
                        value={proj[f]}
                        onChange={(e) => updateProj(i, f, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </GlassPanel>
            ))}
            <button
              type="button"
              className="btn-cyan"
              style={{ width: "100%", padding: "0.75rem" }}
              onClick={() =>
                setCVData((d) => ({
                  ...d,
                  projects: [
                    ...d.projects,
                    { name: "", description: "", url: "" },
                  ],
                }))
              }
            >
              + Add Project
            </button>
          </div>
        )}

        {/* Step 5: Preview */}
        {step === 5 && (
          <div>
            {/* Template selector — 20 templates, 2 free */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p
                style={{
                  color: "#A7B2C8",
                  fontFamily: "Rajdhani",
                  fontSize: "0.85rem",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#2DE3E6" }}>✦ Minimalist</span> &{" "}
                <span style={{ color: "#2DE3E6" }}>Modern</span> are free. All
                others require a subscription.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {templateNames.map((name, i) => {
                  const isPremium = !FREE_TEMPLATE_INDICES.includes(i);
                  const isSelected = selectedTemplate === i;
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => setSelectedTemplate(i)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 50,
                        border: isSelected
                          ? "1px solid #2DE3E6"
                          : isPremium
                            ? "1px solid rgba(139,92,246,0.35)"
                            : "1px solid rgba(255,255,255,0.15)",
                        background: isSelected
                          ? "rgba(45,227,230,0.15)"
                          : isPremium
                            ? "rgba(139,92,246,0.06)"
                            : "transparent",
                        color: isSelected
                          ? "#2DE3E6"
                          : isPremium
                            ? "rgba(139,92,246,0.8)"
                            : "#A7B2C8",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontFamily: "Rajdhani",
                        fontWeight: 600,
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      data-ocid={`cv.template.${i + 1}.button`}
                    >
                      {isPremium && (
                        <span style={{ fontSize: "0.7rem" }}>🔒</span>
                      )}
                      {name}
                    </button>
                  );
                })}
              </div>
              {!FREE_TEMPLATE_INDICES.includes(selectedTemplate) && (
                <p
                  style={{
                    color: "rgba(139,92,246,0.75)",
                    fontFamily: "Rajdhani",
                    fontSize: "0.82rem",
                    marginTop: 8,
                  }}
                >
                  🔒 Premium template — subscribe to unlock full access. Showing
                  preview below.
                </p>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "0.75rem",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                className="btn-cyan"
                style={{ padding: "0.75rem 1.8rem", opacity: saving ? 0.6 : 1 }}
                onClick={saveCV}
                disabled={saving}
                data-ocid="cv.save.primary_button"
              >
                {saving ? "SAVING..." : "💾 SAVE"}
              </button>
              <button
                type="button"
                className="btn-violet"
                style={{ padding: "0.75rem 1.8rem" }}
                onClick={exportPDF}
                data-ocid="cv.export.button"
              >
                📄 PRINT/EXPORT PDF
              </button>
            </div>

            {/* Free saves indicator */}
            <div style={{ marginBottom: "1.5rem" }}>
              {saveCount < 2 ? (
                <p
                  style={{
                    color: "#2DE3E6",
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "0.85rem",
                    letterSpacing: "0.04em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  data-ocid="cv.save.success_state"
                >
                  <span style={{ fontSize: "0.75rem" }}>✦</span>
                  {2 - saveCount} of 2 free saves remaining
                </p>
              ) : (
                <p
                  style={{
                    color: "#8B5CF6",
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "0.85rem",
                    letterSpacing: "0.04em",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  data-ocid="cv.save.error_state"
                >
                  <span style={{ fontSize: "0.75rem" }}>✦</span>Additional
                  saves: PKR 500 each
                </p>
              )}
            </div>

            {/* CV Preview with optional premium watermark */}
            <div style={{ position: "relative" }}>
              {!FREE_TEMPLATE_INDICES.includes(selectedTemplate) && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(139,92,246,0.12)",
                      border: "2px solid rgba(139,92,246,0.3)",
                      borderRadius: 12,
                      padding: "0.75rem 1.75rem",
                      color: "rgba(139,92,246,0.6)",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "1.2rem",
                      letterSpacing: "0.15em",
                      fontWeight: 700,
                      backdropFilter: "blur(2px)",
                    }}
                  >
                    PREMIUM
                  </div>
                </div>
              )}
              <div
                id="cv-preview"
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 4px 30px rgba(0,0,0,0.5)",
                  opacity: !FREE_TEMPLATE_INDICES.includes(selectedTemplate)
                    ? 0.65
                    : 1,
                }}
              >
                <CVTemplates template={selectedTemplate} data={cvData} />
              </div>
            </div>
          </div>
        )}
      </GlassPanel>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        {step > 0 ? (
          <button
            type="button"
            className="btn-violet"
            onClick={() => setStep((s) => s - 1)}
          >
            ← BACK
          </button>
        ) : (
          <span />
        )}
        {step < 5 && (
          <button
            type="button"
            className="btn-cyan"
            onClick={() => setStep((s) => s + 1)}
          >
            NEXT →
          </button>
        )}
      </div>
    </div>
  );
}
