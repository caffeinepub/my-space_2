import { useEffect, useState } from "react";
import { toast } from "sonner";
import GlassPanel from "../components/GlassPanel";
import OracleResponse from "../components/OracleResponse";
import { useAuthModal } from "../context/AuthModalContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function parseGeminiResponse(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? raw;
  } catch {
    return raw;
  }
}

interface HistoryEntry {
  question: string;
  answer: string;
  timestamp: bigint;
}

export default function Oracle() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [remaining, setRemaining] = useState(10);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getRemainingQuestions()
      .then((n) => setRemaining(Number(n)))
      .catch(() => {});
    actor
      .getQuestionHistory()
      .then((h) => setHistory(h as HistoryEntry[]))
      .catch(() => {});
  }, [actor]);

  const handleAsk = async () => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    if (!question.trim() || !actor) return;
    setIsLoading(true);
    setCurrentQuestion(question);
    setCurrentAnswer(null);
    try {
      const raw = await actor.askOracle(question);
      const parsed = parseGeminiResponse(raw);
      setCurrentAnswer(parsed);
      setQuestion("");
      setRemaining((r) => Math.max(0, r - 1));
      actor
        .getQuestionHistory()
        .then((h) => setHistory(h as HistoryEntry[]))
        .catch(() => {});
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("Daily limit")) {
        toast.error("Daily limit reached. Come back tomorrow!");
        setRemaining(0);
      } else if (msg.includes("API key")) {
        toast.error("API key not configured. Contact admin.");
      } else {
        toast.error("Failed to get answer. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
          glowColor="violet"
          style={{
            maxWidth: 460,
            width: "100%",
            padding: "3rem 2.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔐</div>
          <h2
            className="orbitron neon-violet"
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
            Sign in with Internet Identity to access Learning Space and ask up
            to 10 questions per day.
          </p>
          <button
            type="button"
            className="btn-violet"
            style={{ width: "100%", padding: "0.9rem", fontSize: "0.8rem" }}
            onClick={() => openModal("login")}
            data-ocid="oracle.login.primary_button"
          >
            🔐 LOGIN TO CONTINUE
          </button>
        </GlassPanel>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        className="orbitron neon-violet"
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          textAlign: "center",
          marginBottom: "0.5rem",
        }}
      >
        LEARNING SPACE
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "#A7B2C8",
          marginBottom: "1.5rem",
          fontFamily: "Rajdhani",
          fontSize: "1.1rem",
        }}
      >
        Ask anything. Learn step by step.
      </p>

      {/* Usage badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "2rem",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: "rgba(139,92,246,0.1)",
            border: "1px solid rgba(139,92,246,0.4)",
            borderRadius: 50,
            padding: "6px 20px",
            color:
              remaining > 3 ? "#8B5CF6" : remaining > 0 ? "#f59e0b" : "#ef4444",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "0.68rem",
            letterSpacing: "0.1em",
          }}
        >
          {remaining} / 10 QUESTIONS TODAY
        </span>
        {/* Print Q&A button */}
        <button
          type="button"
          className="btn-violet"
          style={{ fontSize: "0.65rem", padding: "0.4rem 1.2rem" }}
          onClick={() => window.print()}
          data-ocid="oracle.print.button"
        >
          🖨️ PRINT Q&A
        </button>
      </div>

      {/* Search bar */}
      <GlassPanel
        glowColor="violet"
        style={{
          padding: "0.5rem",
          marginBottom: "1.5rem",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          className="glass-input"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading && remaining > 0) handleAsk();
          }}
          placeholder="e.g., Explain Newton's Second Law..."
          style={{
            border: "none",
            background: "transparent",
            boxShadow: "none",
            fontSize: "1.05rem",
          }}
          disabled={isLoading || remaining === 0}
          data-ocid="oracle.question.input"
        />
        <button
          type="button"
          className="btn-violet"
          style={{ whiteSpace: "nowrap", padding: "0.7rem 1.4rem" }}
          onClick={handleAsk}
          disabled={isLoading || remaining === 0 || !question.trim() || !actor}
          data-ocid="oracle.ask.primary_button"
        >
          {isLoading ? "..." : "ANALYZE →"}
        </button>
      </GlassPanel>

      {remaining === 0 && (
        <GlassPanel
          style={{
            padding: "1rem 1.5rem",
            textAlign: "center",
            marginBottom: "1.5rem",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <p
            style={{
              color: "#f87171",
              fontFamily: "Rajdhani",
              fontSize: "1rem",
              margin: 0,
            }}
          >
            Daily limit reached. Your 10 questions will reset at midnight UTC.
          </p>
        </GlassPanel>
      )}

      {isLoading && (
        <GlassPanel
          glowColor="violet"
          style={{
            padding: "2rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              color: "#8B5CF6",
              fontFamily: "Orbitron, sans-serif",
              fontSize: "0.85rem",
              letterSpacing: "0.15em",
              animation: "pulse-glow 1.5s infinite",
            }}
          >
            ◈ PROCESSING QUERY...
          </div>
          <p
            style={{
              color: "#A7B2C8",
              fontFamily: "Rajdhani",
              marginTop: "0.5rem",
              fontSize: "0.95rem",
            }}
          >
            "{currentQuestion}"
          </p>
        </GlassPanel>
      )}

      {currentAnswer && !isLoading && (
        <div>
          <GlassPanel
            glowColor="violet"
            style={{ padding: "1rem 1.5rem", marginBottom: "0.5rem" }}
          >
            <p
              style={{
                color: "#A7B2C8",
                fontFamily: "Rajdhani",
                fontSize: "0.9rem",
                margin: 0,
              }}
            >
              Q: <span style={{ color: "#EAF2FF" }}>{currentQuestion}</span>
            </p>
          </GlassPanel>
          <OracleResponse answer={currentAnswer} />
        </div>
      )}

      {/* Q&A History wrapped for print */}
      {history.length > 0 && (
        <div id="qa-print-area" style={{ marginTop: "3rem" }}>
          <h3
            className="orbitron"
            style={{
              fontSize: "0.75rem",
              color: "#A7B2C8",
              letterSpacing: "0.15em",
              marginBottom: "1rem",
            }}
          >
            RECENT HISTORY
          </h3>
          {history.slice(0, 5).map((entry, i) => (
            <GlassPanel
              key={`history-${i}-${entry.timestamp.toString()}`}
              style={{
                padding: "1rem 1.25rem",
                marginBottom: "0.6rem",
                cursor: "pointer",
              }}
              onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              data-ocid={`oracle.history.item.${i + 1}`}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p
                  style={{
                    color: "#A7B2C8",
                    fontFamily: "Rajdhani",
                    fontSize: "0.95rem",
                    margin: 0,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: expandedIdx === i ? "normal" : "nowrap",
                  }}
                >
                  {entry.question}
                </p>
                <span
                  style={{
                    color: "#8B5CF6",
                    marginLeft: 12,
                    fontSize: "0.8rem",
                  }}
                >
                  {expandedIdx === i ? "▲" : "▼"}
                </span>
              </div>
              {expandedIdx === i && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "0.75rem",
                  }}
                >
                  <OracleResponse answer={parseGeminiResponse(entry.answer)} />
                </div>
              )}
            </GlassPanel>
          ))}
        </div>
      )}
    </div>
  );
}
