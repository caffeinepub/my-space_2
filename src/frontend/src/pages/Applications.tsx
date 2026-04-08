import { useState } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import { useAuthModal } from "../context/AuthModalContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const TOOLS = [
  {
    icon: "📝",
    name: "Resume Tailor",
    description: "Customize your CV to match any job description",
    toolName: "resume_tailor",
    placeholder:
      "Paste the job description here, and optionally include your current CV summary...",
  },
  {
    icon: "💼",
    name: "LinkedIn Summary",
    description: "Generate a compelling LinkedIn About section",
    toolName: "linkedin_summary",
    placeholder:
      "Describe your background, skills, and what you're looking for professionally...",
  },
  {
    icon: "📧",
    name: "Cold Email",
    description: "Write personalized outreach emails that get responses",
    toolName: "cold_email",
    placeholder:
      "Who are you reaching out to? What role or company? What's your goal?",
  },
  {
    icon: "🎯",
    name: "Interview Prep",
    description: "Prepare with likely questions and model answers",
    toolName: "interview_prep",
    placeholder:
      "Paste the job description and your relevant experience for tailored interview prep...",
  },
  {
    icon: "💰",
    name: "Salary Negotiation",
    description: "Craft a professional salary negotiation email",
    toolName: "salary_negotiation",
    placeholder:
      "Your current offer, desired salary, and your key selling points...",
  },
  {
    icon: "📜",
    name: "Reference Letter",
    description: "Generate a professional reference letter",
    toolName: "reference_letter",
    placeholder:
      "Who is the reference for? Their role, your relationship, and key strengths to highlight...",
  },
  {
    icon: "🔍",
    name: "Job Analyzer",
    description: "Analyze job descriptions for key requirements",
    toolName: "job_analyzer",
    placeholder:
      "Paste the full job description to extract key skills, requirements, and red flags...",
  },
];

function parseGeminiText(raw: string): string {
  let text = raw;
  try {
    text = JSON.parse(raw)?.candidates?.[0]?.content?.parts?.[0]?.text ?? raw;
  } catch {}
  return text.trim();
}

interface ToolModalProps {
  tool: (typeof TOOLS)[number];
  onClose: () => void;
  actor: any;
}

function ToolModal({ tool, onClose, actor }: ToolModalProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim() || !actor) return;
    setGenerating(true);
    try {
      const raw = await actor.getApplicationTool(tool.toolName, input.trim());
      setOutput(parseGeminiText(raw));
    } catch {
      toast.error("Generation failed. Try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Copied!");
    });
  };

  return (
    <div
      data-ocid="applications.tool.modal"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(7,10,20,0.85)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn 0.15s ease",
        padding: "1rem",
      }}
    >
      {/* Backdrop close */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
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
      <div
        style={{
          maxWidth: 620,
          width: "100%",
          background: "rgba(18,24,38,0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(45,227,230,0.25)",
          borderRadius: 20,
          padding: "2rem",
          position: "relative",
          zIndex: 1,
          animation: "fadeInScale 0.2s ease",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(45,227,230,0.05)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="applications.tool.close_button"
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
          }}
        >
          ✕
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: "2rem" }}>{tool.icon}</span>
          <div>
            <h3
              className="orbitron neon-cyan"
              style={{ fontSize: "1.1rem", margin: 0, letterSpacing: "0.06em" }}
            >
              {tool.name.toUpperCase()}
            </h3>
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              {tool.description}
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "1.25rem" }}>
          <label
            htmlFor="tool-input"
            style={{
              display: "block",
              color: "#A7B2C8",
              fontSize: "0.8rem",
              marginBottom: 6,
            }}
          >
            Input
          </label>
          <textarea
            id="tool-input"
            className="glass-input"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tool.placeholder}
            style={{ resize: "vertical" }}
            data-ocid="applications.tool.input.textarea"
          />
        </div>

        <button
          type="button"
          className="btn-cyan"
          style={{
            width: "100%",
            padding: "0.85rem",
            fontSize: "0.75rem",
            marginBottom: "1.25rem",
            opacity: generating ? 0.7 : 1,
          }}
          onClick={handleGenerate}
          disabled={generating || !input.trim()}
          data-ocid="applications.tool.generate.button"
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
            "✨ GENERATE"
          )}
        </button>

        {output && (
          <>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "1rem",
                marginBottom: "1rem",
                color: "#EAF2FF",
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                whiteSpace: "pre-wrap",
                maxHeight: 300,
                overflowY: "auto",
              }}
              data-ocid="applications.tool.output.panel"
            >
              {output}
            </div>
            <button
              type="button"
              className="btn-cyan"
              style={{ width: "100%", padding: "0.65rem", fontSize: "0.7rem" }}
              onClick={handleCopy}
              data-ocid="applications.tool.copy.button"
            >
              {copied ? "✓ COPIED!" : "📋 COPY"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Applications() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [activeTool, setActiveTool] = useState<(typeof TOOLS)[number] | null>(
    null,
  );

  const handleOpenTool = (tool: (typeof TOOLS)[number]) => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    setActiveTool(tool);
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
            Sign in with Internet Identity to access professional application
            tools.
          </p>
          <button
            type="button"
            className="btn-cyan"
            style={{ width: "100%", padding: "0.9rem", fontSize: "0.8rem" }}
            onClick={() => openModal("login")}
            data-ocid="applications.login.primary_button"
          >
            🔐 LOGIN TO CONTINUE
          </button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem" }}>
      {activeTool && actor && (
        <ToolModal
          tool={activeTool}
          onClose={() => setActiveTool(null)}
          actor={actor}
        />
      )}

      <h1
        className="orbitron neon-cyan"
        style={{
          fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
          marginBottom: "0.5rem",
          textAlign: "center",
        }}
      >
        APPLICATIONS
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
        Professional tools for every stage of your job search
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {TOOLS.map((tool, i) => (
          <GlassPanel
            key={tool.toolName}
            glowColor={i % 2 === 0 ? "cyan" : "violet"}
            style={{
              padding: "1.75rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
            data-ocid={`applications.tool.${i + 1}.card`}
          >
            <div style={{ fontSize: "2rem" }}>{tool.icon}</div>
            <div>
              <h3
                className="orbitron"
                style={{
                  fontSize: "0.82rem",
                  color: "#EAF2FF",
                  letterSpacing: "0.08em",
                  margin: "0 0 6px",
                }}
              >
                {tool.name.toUpperCase()}
              </h3>
              <p
                style={{
                  color: "#A7B2C8",
                  fontFamily: "Rajdhani",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {tool.description}
              </p>
            </div>
            <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
              <button
                type="button"
                className={i % 2 === 0 ? "btn-cyan" : "btn-violet"}
                style={{ fontSize: "0.65rem", padding: "0.55rem 1.4rem" }}
                onClick={() => handleOpenTool(tool)}
                data-ocid={`applications.tool.${i + 1}.button`}
              >
                OPEN TOOL
              </button>
            </div>
          </GlassPanel>
        ))}
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
