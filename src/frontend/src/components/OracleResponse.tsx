import { useEffect, useRef, useState } from "react";
import GlassPanel from "./GlassPanel";

interface Props {
  answer: string;
}

function parseMermaidBlocks(
  text: string,
): { content: string; type: "text" | "mermaid" }[] {
  const parts: { content: string; type: "text" | "mermaid" }[] = [];
  const regex = /```mermaid\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let result = regex.exec(text);
  while (result !== null) {
    if (result.index > lastIndex) {
      parts.push({
        content: text.slice(lastIndex, result.index),
        type: "text",
      });
    }
    parts.push({ content: result[1].trim(), type: "mermaid" });
    lastIndex = result.index + result[0].length;
    result = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push({ content: text.slice(lastIndex), type: "text" });
  }
  return parts;
}

function parseSteps(
  text: string,
): { num: string; label: string; body: string }[] {
  const steps: { num: string; label: string; body: string }[] = [];
  const lines = text.split("\n");
  let current: { num: string; label: string; body: string } | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const stepMatch = trimmed.match(
      /^(\d+)\.\s+(?:\*\*)?([^:*]+)(?::\*\*|\*\*:)?:?\s*(.*)/,
    );
    if (stepMatch) {
      if (current) steps.push(current);
      current = {
        num: stepMatch[1],
        label: stepMatch[2].trim(),
        body: stepMatch[3].trim(),
      };
    } else if (current) {
      current.body += ` ${trimmed}`;
    } else {
      steps.push({ num: "", label: "", body: trimmed });
    }
  }
  if (current) steps.push(current);
  return steps;
}

function MermaidDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  const id = useRef(`mermaid-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    // Use mermaid from CDN (window.mermaid) if available
    const mermaidLib = (window as any).mermaid;
    if (!mermaidLib) {
      setError(true);
      return;
    }
    try {
      mermaidLib.initialize({
        startOnLoad: false,
        theme: "dark",
        darkMode: true,
        securityLevel: "loose",
      });
      const result = mermaidLib.render(id.current, code);
      if (result && typeof result.then === "function") {
        result
          .then(({ svg: rendered }: { svg: string }) => setSvg(rendered))
          .catch(() => setError(true));
      } else if (result?.svg) {
        setSvg(result.svg);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, [code]);

  if (error || !svg) {
    return (
      <GlassPanel
        glowColor="violet"
        style={{ padding: "1rem", marginTop: "1rem" }}
      >
        <pre
          style={{
            color: "#8B5CF6",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            overflowX: "auto",
            margin: 0,
          }}
        >
          {code}
        </pre>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel
      glowColor="violet"
      style={{
        padding: "1.5rem",
        marginTop: "1rem",
        overflowX: "auto",
        textAlign: "center",
      }}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: mermaid renders trusted SVG */}
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </GlassPanel>
  );
}

export default function OracleResponse({ answer }: Props) {
  const parts = parseMermaidBlocks(answer);

  return (
    <div style={{ marginTop: "1rem" }}>
      {parts.map((part, pi) => {
        if (part.type === "mermaid") {
          return (
            <MermaidDiagram
              key={`mermaid-${part.content.slice(0, 20)}-${pi}`}
              code={part.content}
            />
          );
        }

        const steps = parseSteps(part.content);
        return (
          <div key={`block-${part.content.slice(0, 20)}-${pi}`}>
            {steps.map((step, si) => (
              <GlassPanel
                key={`step-${step.num || si}-${step.label.slice(0, 10)}`}
                style={{
                  padding: "1rem 1.25rem",
                  marginBottom: "0.6rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}
              >
                {step.num && (
                  <span
                    style={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        si === 0
                          ? "rgba(45,227,230,0.2)"
                          : "rgba(139,92,246,0.2)",
                      border: `1px solid ${
                        si === 0
                          ? "rgba(45,227,230,0.6)"
                          : "rgba(139,92,246,0.5)"
                      }`,
                      color: si === 0 ? "#2DE3E6" : "#8B5CF6",
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </span>
                )}
                <div style={{ flex: 1 }}>
                  {step.label && (
                    <span
                      style={{
                        color: si === 0 ? "#2DE3E6" : "#8B5CF6",
                        fontFamily: "Orbitron, sans-serif",
                        fontSize: "0.7rem",
                        letterSpacing: "0.06em",
                        marginRight: 8,
                        textTransform: "uppercase",
                      }}
                    >
                      {step.label}:
                    </span>
                  )}
                  <span
                    style={{
                      color: "#EAF2FF",
                      lineHeight: 1.6,
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: "1.05rem",
                    }}
                  >
                    {step.body}
                  </span>
                </div>
              </GlassPanel>
            ))}
          </div>
        );
      })}
    </div>
  );
}
