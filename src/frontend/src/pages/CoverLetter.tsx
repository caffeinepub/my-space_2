import { useEffect, useState } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import { useAuthModal } from "../context/AuthModalContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const LETTER_TYPES = [
  "Formal",
  "Creative",
  "Internship",
  "Academic",
  "Tech",
  "Sales",
];

function parseGeminiText(raw: string): string {
  let text = raw;
  try {
    text = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text ?? raw;
  } catch {}
  return text.trim();
}

export default function CoverLetter() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  const [jobTitle, setJobTitle] = useState("");
  const [userSummary, setUserSummary] = useState("");
  const [selectedType, setSelectedType] = useState("Formal");
  const [generating, setGenerating] = useState(false);
  const [letterOutput, setLetterOutput] = useState("");
  const [copied, setCopied] = useState(false);

  // Auto-populate summary from CV profile
  useEffect(() => {
    if (!actor || !isAuthenticated) return;
    actor
      .getCVProfile()
      .then((opt) => {
        if (opt && opt.__kind__ === "Some") {
          const val = opt.value as any;
          if (val?.summary) setUserSummary(val.summary);
        }
      })
      .catch(() => {});
  }, [actor, isAuthenticated]);

  const handleGenerate = async () => {
    if (!actor || !jobTitle.trim() || !userSummary.trim()) {
      toast.error("Please fill in both Job Title and your Background/Summary.");
      return;
    }
    setGenerating(true);
    try {
      const raw = await (actor as any).getCoverLetter(
        jobTitle.trim(),
        userSummary.trim(),
        selectedType,
      );
      setLetterOutput(parseGeminiText(raw));
    } catch {
      toast.error("Failed to generate cover letter. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letterOutput).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied to clipboard!");
    });
  };

  // Login gate
  if (!isAuthenticated && actor) {
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
            Sign in with Internet Identity to generate AI-powered cover letters.
          </p>
          <button
            type="button"
            className="btn-cyan"
            style={{ width: "100%", padding: "0.9rem", fontSize: "0.8rem" }}
            onClick={() => openModal("login")}
            data-ocid="cover_letter.login.primary_button"
          >
            🔐 LOGIN TO CONTINUE
          </button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        className="orbitron neon-cyan"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        COVER LETTER
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#A7B2C8",
          marginBottom: "2.5rem",
          fontFamily: "Rajdhani",
          fontSize: "1.1rem",
        }}
      >
        AI-generated cover letters tailored to your profile
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Left: Controls */}
        <GlassPanel glowColor="cyan" style={{ padding: "2rem" }}>
          <h2
            className="orbitron"
            style={{
              fontSize: "0.8rem",
              color: "#A7B2C8",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            CONFIGURE
          </h2>

          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="cl-job-title"
              style={{
                display: "block",
                color: "#A7B2C8",
                fontSize: "0.8rem",
                marginBottom: 6,
              }}
            >
              Job Title
            </label>
            <input
              id="cl-job-title"
              className="glass-input"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              data-ocid="cover_letter.job_title.input"
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              htmlFor="cl-summary"
              style={{
                display: "block",
                color: "#A7B2C8",
                fontSize: "0.8rem",
                marginBottom: 6,
              }}
            >
              Your Background / Summary
            </label>
            <textarea
              id="cl-summary"
              className="glass-input"
              rows={5}
              value={userSummary}
              onChange={(e) => setUserSummary(e.target.value)}
              placeholder="Briefly describe your background, skills, and experience..."
              style={{ resize: "vertical" }}
              data-ocid="cover_letter.summary.textarea"
            />
          </div>

          <div style={{ marginBottom: "1.75rem" }}>
            <p
              style={{
                display: "block",
                color: "#A7B2C8",
                fontSize: "0.8rem",
                marginBottom: 8,
                margin: "0 0 8px",
              }}
            >
              Cover Letter Type
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {LETTER_TYPES.map((type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setSelectedType(type)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 50,
                    border:
                      selectedType === type
                        ? "1px solid #2DE3E6"
                        : "1px solid rgba(255,255,255,0.15)",
                    background:
                      selectedType === type
                        ? "rgba(45,227,230,0.15)"
                        : "transparent",
                    color: selectedType === type ? "#2DE3E6" : "#A7B2C8",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontFamily: "Rajdhani",
                    fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                  data-ocid={`cover_letter.type.${type.toLowerCase()}.button`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="btn-cyan"
            style={{
              width: "100%",
              padding: "0.9rem",
              fontSize: "0.78rem",
              opacity: generating ? 0.7 : 1,
            }}
            onClick={handleGenerate}
            disabled={generating || !jobTitle.trim() || !userSummary.trim()}
            data-ocid="cover_letter.generate.primary_button"
          >
            {generating ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    border: "2px solid rgba(45,227,230,0.3)",
                    borderTopColor: "#2DE3E6",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                GENERATING...
              </span>
            ) : (
              "✨ GENERATE COVER LETTER"
            )}
          </button>
        </GlassPanel>

        {/* Right: Output */}
        <GlassPanel
          glowColor="violet"
          style={{ padding: "2rem", display: "flex", flexDirection: "column" }}
        >
          <h2
            className="orbitron"
            style={{
              fontSize: "0.8rem",
              color: "#A7B2C8",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            OUTPUT
          </h2>

          {!letterOutput && !generating && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(167,178,200,0.35)",
                fontFamily: "Rajdhani",
                fontSize: "1rem",
                fontStyle: "italic",
                textAlign: "center",
              }}
            >
              Your cover letter will appear here...
            </div>
          )}
          {generating && (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="neon-violet orbitron"
                style={{
                  fontSize: "0.8rem",
                  letterSpacing: "0.15em",
                  animation: "pulse-glow 1.5s infinite",
                }}
              >
                GENERATING...
              </div>
            </div>
          )}
          {letterOutput && !generating && (
            <>
              <div id="cover-letter-output" style={{ flex: 1 }}>
                <textarea
                  className="glass-input"
                  rows={20}
                  value={letterOutput}
                  onChange={(e) => setLetterOutput(e.target.value)}
                  style={{
                    resize: "vertical",
                    width: "100%",
                    minHeight: 380,
                    lineHeight: 1.7,
                  }}
                  data-ocid="cover_letter.output.textarea"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: "1rem",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  className="btn-violet"
                  style={{ flex: 1, padding: "0.7rem", fontSize: "0.7rem" }}
                  onClick={() => window.print()}
                  data-ocid="cover_letter.print.button"
                >
                  🖨️ PRINT / EXPORT
                </button>
                <button
                  type="button"
                  className="btn-cyan"
                  style={{ flex: 1, padding: "0.7rem", fontSize: "0.7rem" }}
                  onClick={handleCopy}
                  data-ocid="cover_letter.copy.button"
                >
                  {copied ? "✓ COPIED!" : "📋 COPY"}
                </button>
              </div>
            </>
          )}
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
