// 20 CV Template Components
import type React from "react";

export interface CVData {
  name: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  github: string;
  website: string;
  experience: {
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  projects: { name: string; description: string; url: string }[];
}

export const templateNames = [
  "Minimalist",
  "Modern",
  "Executive",
  "Creative",
  "Academic",
  "Tech",
  "Compact",
  "Elegant",
  "Bold",
  "Gradient",
  "Timeline",
  "Infographic",
  "Clean",
  "Professional",
  "Startup",
  "Corporate",
  "Artistic",
  "Classic",
  "Contemporary",
  "Digital",
];

// Templates 0 (Minimalist) and 1 (Modern) are free; all others require premium
export const FREE_TEMPLATE_INDICES = [0, 1];

const base: React.CSSProperties = {
  fontFamily: "Arial, Helvetica, sans-serif",
  minHeight: 1100,
  padding: 40,
  boxSizing: "border-box",
};

function ContactLine({ data }: { data: CVData }) {
  const parts = [
    data.email,
    data.phone,
    data.location,
    data.linkedin,
    data.github,
    data.website,
  ].filter(Boolean);
  return (
    <p style={{ fontSize: 11, color: "#555", margin: "4px 0 0" }}>
      {parts.join(" • ")}
    </p>
  );
}

function Section({
  title,
  children,
  color,
}: { title: string; children: React.ReactNode; color?: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: color || "#888",
          borderBottom: `1px solid ${color ? `${color}44` : "#eee"}`,
          paddingBottom: 4,
          marginBottom: 10,
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- 1. Minimalist (FREE) ---
function MinimalistTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222" }}>
      <div
        style={{
          borderBottom: "2px solid #222",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <ContactLine data={data} />
      </div>
      {data.summary && (
        <Section title="Summary">
          <p
            style={{ fontSize: 12, lineHeight: 1.6, color: "#444", margin: 0 }}
          >
            {data.summary}
          </p>
        </Section>
      )}
      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13 }}>{e.title}</strong>
                <span style={{ fontSize: 11, color: "#666" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 6 }}>
                {e.company}
              </div>
              <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 12, lineHeight: 1.5, color: "#444" }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 13 }}>{e.degree}</strong>
                <span style={{ fontSize: 11, color: "#666" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#555" }}>{e.school}</div>
            </div>
          ))}
        </Section>
      )}
      {data.skills.length > 0 && (
        <Section title="Skills">
          <p style={{ fontSize: 12, color: "#444", margin: 0 }}>
            {data.skills.join(" • ")}
          </p>
        </Section>
      )}
    </div>
  );
}

// --- 2. Modern (FREE) ---
function ModernTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222", padding: 0 }}>
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(45,227,230,0.15) 0%, rgba(139,92,246,0.1) 100%)",
          padding: "36px 40px 28px",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, color: "#111" }}>
          {data.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 12, color: "#555", margin: "8px 0 0" }}>
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </p>
      </div>
      <div style={{ padding: 40 }}>
        {data.summary && (
          <div
            style={{
              background: "#f9f9fb",
              borderRadius: 10,
              padding: "16px 20px",
              marginBottom: 28,
              borderLeft: "4px solid #2DE3E6",
            }}
          >
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "#444",
                margin: 0,
              }}
            >
              {data.summary}
            </p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontSize: 14,
                color: "#8B5CF6",
                fontWeight: 700,
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Experience
            </h3>
            {data.experience.map((e, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  marginBottom: 20,
                  background: "#f9f9fb",
                  borderRadius: 8,
                  padding: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <strong style={{ fontSize: 13 }}>{e.title}</strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#888",
                      background: "#ede9fe",
                      borderRadius: 20,
                      padding: "2px 10px",
                    }}
                  >
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#2DE3E6",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {e.company}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {e.bullets.filter(Boolean).map((b, bi) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                      key={bi}
                      style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {data.education.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 14,
                  color: "#8B5CF6",
                  fontWeight: 700,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Education
              </h3>
              {data.education.map((e, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    background: "#f9f9fb",
                    borderRadius: 8,
                  }}
                >
                  <strong style={{ fontSize: 12 }}>{e.degree}</strong>
                  <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 14,
                  color: "#8B5CF6",
                  fontWeight: 700,
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.map((s, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={i}
                    style={{
                      background: "#ede9fe",
                      color: "#6d28d9",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 11,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 3. Executive (PREMIUM) ---
function ExecutiveTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222", padding: 0 }}>
      <div
        style={{
          background: "#1a1a2e",
          color: "#fff",
          padding: "32px 40px 24px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 11, color: "#aaa", margin: "6px 0 0" }}>
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 0 }}>
        <div
          style={{
            background: "#f5f5f7",
            padding: 30,
            borderRight: "1px solid #e0e0e0",
          }}
        >
          {data.skills.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h4
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1a1a2e",
                  marginBottom: 10,
                }}
              >
                Skills
              </h4>
              {data.skills.map((s, i) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    fontSize: 12,
                    color: "#444",
                    marginBottom: 4,
                    paddingLeft: 10,
                    borderLeft: "2px solid #1a1a2e",
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
          {data.education.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1a1a2e",
                  marginBottom: 10,
                }}
              >
                Education
              </h4>
              {data.education.map((e, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>
                    {e.degree}
                  </div>
                  <div style={{ fontSize: 11, color: "#666" }}>{e.school}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ padding: 30 }}>
          {data.summary && (
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "#444",
                marginBottom: 24,
                borderLeft: "3px solid #1a1a2e",
                paddingLeft: 12,
              }}
            >
              {data.summary}
            </p>
          )}
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <strong style={{ fontSize: 13 }}>{e.title}</strong>
                <span style={{ fontSize: 11, color: "#888" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#1a1a2e",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                {e.company}
              </div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4. Creative (PREMIUM) ---
function CreativeTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "#fff",
        color: "#222",
        padding: 0,
        display: "flex",
      }}
    >
      <div
        style={{
          width: 240,
          background: "linear-gradient(180deg, #0d7377 0%, #14a085 100%)",
          color: "#fff",
          padding: 30,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            border: "2px solid rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            marginBottom: 16,
          }}
        >
          {(data.name || "Y").charAt(0).toUpperCase()}
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 4px" }}>
          {data.name || "Your Name"}
        </h2>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.3)",
            marginTop: 16,
            paddingTop: 16,
          }}
        >
          {[data.email, data.phone, data.location, data.linkedin]
            .filter(Boolean)
            .map((c, i) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  fontSize: 10,
                  margin: "0 0 6px",
                  wordBreak: "break-all",
                  opacity: 0.9,
                }}
              >
                {c}
              </p>
            ))}
        </div>
        {data.skills.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4
              style={{
                fontSize: 10,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 10,
                opacity: 0.8,
              }}
            >
              Skills
            </h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 20,
                    padding: "2px 8px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: 30 }}>
        {data.summary && (
          <p
            style={{
              fontSize: 12,
              color: "#555",
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {data.summary}
          </p>
        )}
        {data.experience.map((e, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            key={i}
            style={{
              marginBottom: 20,
              position: "relative",
              paddingLeft: 18,
              borderLeft: "2px solid #0d7377",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -5,
                top: 4,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#0d7377",
              }}
            />
            <strong style={{ fontSize: 13 }}>{e.title}</strong>
            <div style={{ fontSize: 11, color: "#0d7377", marginBottom: 4 }}>
              {e.company} • {e.startDate}
              {e.endDate ? ` – ${e.endDate}` : ""}
            </div>
            <ul style={{ margin: 0, paddingLeft: 14 }}>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{ fontSize: 11, lineHeight: 1.5, color: "#555" }}
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {data.education.map((e, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static template data
          <div key={i} style={{ marginBottom: 12 }}>
            <strong style={{ fontSize: 12 }}>{e.degree}</strong>
            <div style={{ fontSize: 11, color: "#0d7377" }}>
              {e.school} • {e.startDate}
              {e.endDate ? ` – ${e.endDate}` : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 5. Academic (PREMIUM) ---
function AcademicTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#111" }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: 24,
          borderBottom: "2px double #333",
          paddingBottom: 16,
        }}
      >
        <h1 style={{ fontSize: 26, margin: 0, fontWeight: 700 }}>
          {data.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 11, color: "#555", margin: "6px 0 0" }}>
          {[data.email, data.phone, data.location].filter(Boolean).join(" | ")}
        </p>
      </div>
      {data.summary && (
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #333",
              paddingBottom: 3,
              marginBottom: 8,
            }}
          >
            Research Statement
          </h3>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              fontStyle: "italic",
              color: "#333",
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.education.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #333",
              paddingBottom: 3,
              marginBottom: 10,
            }}
          >
            Education
          </h3>
          {data.education.map((e, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div>
                <strong style={{ fontSize: 13 }}>{e.degree}</strong>
                <div style={{ fontSize: 12, color: "#555" }}>{e.school}</div>
              </div>
              <div style={{ fontSize: 11, color: "#777", textAlign: "right" }}>
                {e.startDate}
                {e.endDate ? ` – ${e.endDate}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #333",
              paddingBottom: 3,
              marginBottom: 10,
            }}
          >
            Academic & Professional Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 12 }}>
                  {e.title}, {e.company}
                </strong>
                <span style={{ fontSize: 11, color: "#777" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, lineHeight: 1.6, color: "#444" }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #333",
              paddingBottom: 3,
              marginBottom: 8,
            }}
          >
            Technical Skills
          </h3>
          <p style={{ fontSize: 12, color: "#333" }}>
            {data.skills.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

// --- 6. Tech (PREMIUM) ---
function TechTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#0f0f1a", color: "#e0e0e0" }}>
      <div
        style={{
          borderBottom: "1px solid rgba(45,227,230,0.3)",
          paddingBottom: 20,
          marginBottom: 24,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#00ff88",
            fontFamily: "Courier New, monospace",
          }}
        >
          <span style={{ color: "#2DE3E6" }}>{"> "}</span>
          {data.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: 11,
            color: "#888",
            margin: "6px 0 0",
            fontFamily: "Courier New, monospace",
          }}
        >
          {[data.email, data.phone, data.github, data.linkedin]
            .filter(Boolean)
            .join(" | ")}
        </p>
      </div>
      {data.summary && (
        <div
          style={{
            marginBottom: 20,
            background: "rgba(45,227,230,0.05)",
            borderLeft: "3px solid #2DE3E6",
            padding: "10px 14px",
            borderRadius: "0 8px 8px 0",
          }}
        >
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: "#bbb",
              margin: 0,
              fontFamily: "Courier New, monospace",
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3
            style={{
              fontSize: 11,
              color: "#2DE3E6",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 14,
              fontFamily: "Courier New, monospace",
            }}
          >
            {"// EXPERIENCE"}
          </h3>
          {data.experience.map((e, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                marginBottom: 18,
                paddingLeft: 16,
                borderLeft: "1px dashed rgba(45,227,230,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <strong style={{ fontSize: 13, color: "#00ff88" }}>
                  {e.title}
                </strong>
                <span
                  style={{
                    fontSize: 11,
                    color: "#555",
                    fontFamily: "Courier New, monospace",
                  }}
                >
                  {e.startDate}
                  {e.endDate ? ` - ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#2DE3E6", marginBottom: 6 }}>
                @{e.company}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{
                    fontSize: 11,
                    color: "#bbb",
                    lineHeight: 1.6,
                    fontFamily: "Courier New, monospace",
                  }}
                >
                  <span style={{ color: "#555" }}>&bull; </span>
                  {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <h3
            style={{
              fontSize: 11,
              color: "#2DE3E6",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "Courier New, monospace",
            }}
          >
            {"// SKILLS"}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.skills.map((s, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  background: "rgba(0,255,136,0.1)",
                  border: "1px solid rgba(0,255,136,0.3)",
                  color: "#00ff88",
                  borderRadius: 4,
                  padding: "2px 10px",
                  fontSize: 11,
                  fontFamily: "Courier New, monospace",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {data.education.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 11,
              color: "#2DE3E6",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 12,
              fontFamily: "Courier New, monospace",
            }}
          >
            {"// EDUCATION"}
          </h3>
          {data.education.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 12, color: "#00ff88" }}>
                {e.degree}
              </strong>
              <div
                style={{
                  fontSize: 11,
                  color: "#888",
                  fontFamily: "Courier New, monospace",
                }}
              >
                {e.school} • {e.startDate}
                {e.endDate ? ` - ${e.endDate}` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- 7. Compact (PREMIUM) ---
function CompactTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "#fff",
        color: "#222",
        padding: "28px 36px",
        fontSize: 11,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1.5px solid #333",
          paddingBottom: 10,
          marginBottom: 14,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
          {data.name || "Your Name"}
        </h1>
        <div style={{ textAlign: "right", fontSize: 10, color: "#666" }}>
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i}>{c}</div>
            ))}
        </div>
      </div>
      {data.summary && (
        <p
          style={{
            fontSize: 11,
            color: "#444",
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#555",
              marginBottom: 6,
            }}
          >
            Experience
          </div>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                marginBottom: 8,
                paddingLeft: 10,
                borderLeft: "2px solid #ddd",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>
                  {e.title} — {e.company}
                </span>
                <span style={{ color: "#888", fontSize: 10 }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                <div key={bi} style={{ color: "#555", paddingLeft: 8 }}>
                  • {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {data.education.length > 0 && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#555",
                marginBottom: 4,
              }}
            >
              Education
            </div>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontWeight: 600 }}>{e.degree}</div>
                <div style={{ color: "#666" }}>
                  {e.school}, {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#555",
                marginBottom: 4,
              }}
            >
              Skills
            </div>
            <div style={{ color: "#444" }}>{data.skills.join(", ")}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 8. Elegant (PREMIUM) ---
function ElegantTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fdfaf6", color: "#2c2c2c" }}>
      <div style={{ textAlign: "center", marginBottom: 32, padding: "0 20px" }}>
        <h1
          style={{
            margin: 0,
            fontSize: 34,
            fontWeight: 300,
            letterSpacing: "0.15em",
            fontFamily: "Georgia, serif",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <div
          style={{
            width: 60,
            height: 1,
            background: "#b8860b",
            margin: "12px auto",
          }}
        />
        <p style={{ fontSize: 11, color: "#888", letterSpacing: "0.06em" }}>
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .join("  ·  ")}
        </p>
      </div>
      {data.summary && (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.9,
            color: "#555",
            textAlign: "center",
            maxWidth: 500,
            margin: "0 auto 28px",
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#b8860b",
              textAlign: "center",
              marginBottom: 14,
            }}
          >
            Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 18, textAlign: "center" }}>
              <strong style={{ fontSize: 13, fontFamily: "Georgia, serif" }}>
                {e.title}
              </strong>
              <div style={{ fontSize: 11, color: "#b8860b", margin: "3px 0" }}>
                {e.company} · {e.startDate}
                {e.endDate ? ` – ${e.endDate}` : ""}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <p
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{ fontSize: 11, color: "#555", margin: "2px 0" }}
                >
                  {b}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          borderTop: "1px solid #e0d5c5",
          paddingTop: 20,
        }}
      >
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8860b",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontFamily: "Georgia, serif",
                    fontSize: 12,
                  }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 11, color: "#777" }}>{e.school}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#b8860b",
                marginBottom: 10,
              }}
            >
              Skills
            </h3>
            {data.skills.map((s, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{ fontSize: 11, color: "#555", marginBottom: 3 }}
              >
                — {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 9. Bold (PREMIUM) ---
function BoldTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#111", padding: 0 }}>
      <div
        style={{ background: "#111", color: "#fff", padding: "40px 40px 30px" }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 36,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          {data.name || "YOUR NAME"}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.6)",
            margin: "8px 0 0",
          }}
        >
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </p>
      </div>
      <div style={{ padding: "30px 40px" }}>
        {data.summary && (
          <p
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: "#333",
              marginBottom: 28,
              fontWeight: 500,
            }}
          >
            {data.summary}
          </p>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 900,
                textTransform: "uppercase",
                borderBottom: "3px solid #111",
                paddingBottom: 6,
                marginBottom: 16,
              }}
            >
              Experience
            </h2>
            {data.experience.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <strong style={{ fontSize: 14, fontWeight: 800 }}>
                    {e.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#666",
                      background: "#f0f0f0",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#444",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {e.company}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {e.bullets.filter(Boolean).map((b, bi) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                      key={bi}
                      style={{ fontSize: 12, color: "#555", lineHeight: 1.5 }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {data.education.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  borderBottom: "3px solid #111",
                  paddingBottom: 6,
                  marginBottom: 12,
                }}
              >
                Education
              </h2>
              {data.education.map((e, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>
                    {e.degree}
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  borderBottom: "3px solid #111",
                  paddingBottom: 6,
                  marginBottom: 12,
                }}
              >
                Skills
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.map((s, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={i}
                    style={{
                      background: "#111",
                      color: "#fff",
                      borderRadius: 4,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 10. Gradient (PREMIUM) ---
function GradientTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: 0,
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          padding: "36px 40px 28px",
          marginBottom: 2,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
          {data.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.8)",
            margin: "8px 0 0",
          }}
        >
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </p>
      </div>
      <div style={{ padding: "24px 40px" }}>
        {data.summary && (
          <div
            style={{
              background: "rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "14px 18px",
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.9)",
                margin: 0,
              }}
            >
              {data.summary}
            </p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
                marginBottom: 14,
              }}
            >
              Experience
            </h3>
            {data.experience.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "14px 16px",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <strong style={{ fontSize: 13 }}>{e.title}</strong>
                  <span
                    style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}
                  >
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.7)",
                    marginBottom: 6,
                  }}
                >
                  {e.company}
                </div>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}
                  >
                    • {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
        >
          {data.education.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 10,
                }}
              >
                Education
              </h3>
              {data.education.map((e, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 12 }}>
                    {e.degree}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                    {e.school}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 10,
                }}
              >
                Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {data.skills.map((s, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      borderRadius: 20,
                      padding: "3px 10px",
                      fontSize: 11,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 11. Timeline (PREMIUM) ---
function TimelineTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222" }}>
      <div
        style={{
          borderBottom: "3px solid #e91e63",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <h1
          style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#e91e63" }}
        >
          {data.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 11, color: "#777", margin: "6px 0 0" }}>
          {[data.email, data.phone, data.location].filter(Boolean).join(" • ")}
        </p>
      </div>
      {data.summary && (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.7,
            color: "#444",
            marginBottom: 24,
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#e91e63",
              marginBottom: 16,
            }}
          >
            Career Timeline
          </h3>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div
              style={{
                position: "absolute",
                left: 7,
                top: 0,
                bottom: 0,
                width: 2,
                background: "#e91e63",
                opacity: 0.3,
              }}
            />
            {data.experience.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  position: "relative",
                  marginBottom: 20,
                  paddingLeft: 16,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -17,
                    top: 4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#e91e63",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 2px #e91e63",
                  }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong style={{ fontSize: 13 }}>{e.title}</strong>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#e91e63",
                      background: "#fce4ec",
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div
                  style={{ fontSize: 11, color: "#666", margin: "3px 0 6px" }}
                >
                  {e.company}
                </div>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, color: "#555", marginBottom: 2 }}
                  >
                    • {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#e91e63",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{e.degree}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{e.school}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#e91e63",
                marginBottom: 10,
              }}
            >
              Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "#fce4ec",
                    color: "#e91e63",
                    borderRadius: 20,
                    padding: "2px 8px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 12. Infographic (PREMIUM) ---
function InfographicTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "#f8f9fa",
        color: "#222",
        padding: 0,
        display: "flex",
      }}
    >
      <div
        style={{
          width: 200,
          background: "#2c3e50",
          color: "#fff",
          padding: 24,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3498db, #9b59b6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 12,
            margin: "0 auto 12px",
          }}
        >
          {(data.name || "Y").charAt(0)}
        </div>
        <h2
          style={{
            fontSize: 14,
            textAlign: "center",
            margin: "0 0 16px",
            fontWeight: 600,
          }}
        >
          {data.name || "Your Name"}
        </h2>
        <div style={{ fontSize: 9, opacity: 0.7, marginBottom: 16 }}>
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 4, wordBreak: "break-all" }}>
                {c}
              </div>
            ))}
        </div>
        {data.skills.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                opacity: 0.6,
                marginBottom: 8,
              }}
            >
              Skills
            </div>
            {data.skills.slice(0, 8).map((s, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, marginBottom: 2 }}>{s}</div>
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.15)",
                    borderRadius: 2,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${80 - i * 5}%`,
                      background: "#3498db",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ flex: 1, padding: 24 }}>
        {data.summary && (
          <div
            style={{
              background: "#e8f4f8",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 18,
              borderLeft: "3px solid #3498db",
            }}
          >
            <p
              style={{
                fontSize: 11,
                color: "#333",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {data.summary}
            </p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#2c3e50",
                borderBottom: "2px solid #3498db",
                paddingBottom: 4,
                marginBottom: 12,
              }}
            >
              Experience
            </h3>
            {data.experience.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  marginBottom: 14,
                  paddingLeft: 10,
                  borderLeft: "2px solid #e0e0e0",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <strong style={{ fontSize: 12 }}>{e.title}</strong>
                  <span style={{ fontSize: 9, color: "#3498db" }}>
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div style={{ fontSize: 10, color: "#666", marginBottom: 4 }}>
                  {e.company}
                </div>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 10, color: "#555", marginBottom: 2 }}
                  >
                    • {b}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#2c3e50",
                borderBottom: "2px solid #9b59b6",
                paddingBottom: 4,
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <strong style={{ fontSize: 11 }}>{e.degree}</strong>
                <div style={{ fontSize: 10, color: "#666" }}>
                  {e.school} · {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 13. Clean (PREMIUM) ---
function CleanTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#1a1a1a" }}>
      <h1
        style={{
          margin: "0 0 4px",
          fontSize: 26,
          fontWeight: 300,
          letterSpacing: "0.08em",
        }}
      >
        {data.name || "Your Name"}
      </h1>
      <p style={{ fontSize: 11, color: "#999", margin: "0 0 20px" }}>
        {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
      </p>
      <div
        style={{
          height: 1,
          background: "linear-gradient(to right, #1a1a1a, transparent)",
          marginBottom: 24,
        }}
      />
      {data.summary && (
        <p
          style={{
            fontSize: 12,
            color: "#555",
            lineHeight: 1.8,
            marginBottom: 24,
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <Section title="Work Experience">
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 2,
                }}
              >
                <strong style={{ fontSize: 12 }}>{e.title}</strong>
                <span style={{ fontSize: 10, color: "#999" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#777", marginBottom: 5 }}>
                {e.company}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{
                    fontSize: 11,
                    color: "#555",
                    paddingLeft: 12,
                    position: "relative",
                  }}
                >
                  · {b}
                </div>
              ))}
            </div>
          ))}
        </Section>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {data.education.length > 0 && (
          <Section title="Education">
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{e.degree}</div>
                <div style={{ fontSize: 11, color: "#777" }}>{e.school}</div>
                <div style={{ fontSize: 10, color: "#999" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </div>
              </div>
            ))}
          </Section>
        )}
        {data.skills.length > 0 && (
          <Section title="Skills">
            {data.skills.map((s, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                key={i}
                style={{
                  fontSize: 11,
                  color: "#555",
                  marginBottom: 3,
                  paddingLeft: 8,
                  borderLeft: "1px solid #eee",
                }}
              >
                {s}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

// --- 14. Professional (PREMIUM) ---
function ProfessionalTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222", padding: 0 }}>
      <div
        style={{ background: "#003366", color: "#fff", padding: "32px 40px" }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <div
          style={{
            width: 40,
            height: 2,
            background: "#66aaff",
            margin: "10px 0",
          }}
        />
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0 }}>
          {[data.email, data.phone, data.location, data.linkedin]
            .filter(Boolean)
            .join(" • ")}
        </p>
      </div>
      <div style={{ padding: "28px 40px" }}>
        {data.summary && (
          <div
            style={{
              borderLeft: "4px solid #003366",
              paddingLeft: 14,
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "#333",
                margin: 0,
              }}
            >
              {data.summary}
            </p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#003366",
                borderBottom: "2px solid #003366",
                paddingBottom: 5,
                marginBottom: 14,
              }}
            >
              Professional Experience
            </h3>
            {data.experience.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <strong style={{ fontSize: 13, color: "#003366" }}>
                    {e.title}
                  </strong>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#666",
                      background: "#e8eef4",
                      padding: "2px 8px",
                      borderRadius: 3,
                    }}
                  >
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#444",
                    marginBottom: 6,
                    fontStyle: "italic",
                  }}
                >
                  {e.company}
                </div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {e.bullets.filter(Boolean).map((b, bi) => (
                    <li
                      // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                      key={bi}
                      style={{ fontSize: 11, color: "#555", lineHeight: 1.5 }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {data.education.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#003366",
                  borderBottom: "2px solid #003366",
                  paddingBottom: 5,
                  marginBottom: 12,
                }}
              >
                Education
              </h3>
              {data.education.map((e, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 12, color: "#003366" }}>
                    {e.degree}
                  </strong>
                  <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>
                    {e.startDate}
                    {e.endDate ? ` – ${e.endDate}` : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
          {data.skills.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#003366",
                  borderBottom: "2px solid #003366",
                  paddingBottom: 5,
                  marginBottom: 12,
                }}
              >
                Core Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {data.skills.map((s, i) => (
                  <span
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={i}
                    style={{
                      background: "#e8eef4",
                      color: "#003366",
                      borderRadius: 3,
                      padding: "3px 8px",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 15. Startup (PREMIUM) ---
function StartupTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#0a0a0a", color: "#f0f0f0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          paddingBottom: 20,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 30,
              fontWeight: 800,
              background: "linear-gradient(135deg, #00ff88, #00bfff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {data.name || "Your Name"}
          </h1>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              margin: "6px 0 0",
            }}
          >
            {[data.email, data.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {[data.location, data.linkedin, data.github]
            .filter(Boolean)
            .map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i}>{c}</div>
            ))}
        </div>
      </div>
      {data.summary && (
        <div
          style={{
            background: "rgba(0,255,136,0.06)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 24,
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#00ff88",
              marginBottom: 14,
            }}
          >
            Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                marginBottom: 16,
                padding: "12px 16px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <strong style={{ fontSize: 13, color: "#00ff88" }}>
                  {e.title}
                </strong>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#00bfff", marginBottom: 6 }}>
                {e.company}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: 2,
                  }}
                >
                  → {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#00bfff",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: "#f0f0f0" }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                  {e.school}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "#00bfff",
                marginBottom: 10,
              }}
            >
              Stack
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "rgba(0,255,136,0.1)",
                    border: "1px solid rgba(0,255,136,0.3)",
                    color: "#00ff88",
                    borderRadius: 4,
                    padding: "2px 8px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 16. Corporate (PREMIUM) ---
function CorporateTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#fff", color: "#222" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 0,
          borderBottom: "3px solid #1565c0",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              color: "#1565c0",
            }}
          >
            {data.name || "Your Name"}
          </h1>
          <p style={{ fontSize: 11, color: "#555", margin: "6px 0 0" }}>
            {[data.email, data.phone].filter(Boolean).join(" | ")}
          </p>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#777" }}>
          {[data.location, data.linkedin].filter(Boolean).map((c, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 3 }}>
              {c}
            </div>
          ))}
        </div>
      </div>
      {data.summary && (
        <div
          style={{
            background: "#e3f2fd",
            borderLeft: "4px solid #1565c0",
            padding: "10px 14px",
            marginBottom: 24,
            borderRadius: "0 6px 6px 0",
          }}
        >
          <p
            style={{
              fontSize: 12,
              color: "#1a237e",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#1565c0",
              marginBottom: 14,
              paddingBottom: 4,
              borderBottom: "1px solid #e3f2fd",
            }}
          >
            Professional Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 16 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  background: "#f5f9ff",
                  padding: "6px 10px",
                  borderRadius: 4,
                  marginBottom: 6,
                }}
              >
                <strong style={{ fontSize: 12, color: "#1565c0" }}>
                  {e.title} — {e.company}
                </strong>
                <span style={{ fontSize: 10, color: "#1565c0" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, color: "#444", lineHeight: 1.5 }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#1565c0",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#1565c0" }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#1565c0",
                marginBottom: 10,
              }}
            >
              Key Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "#e3f2fd",
                    color: "#1565c0",
                    border: "1px solid #90caf9",
                    borderRadius: 3,
                    padding: "2px 8px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 17. Artistic (PREMIUM) ---
function ArtisticTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#1a0533", color: "#f0e6ff" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 300,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #ff6b9d, #c44dff, #6b9dff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <div
          style={{
            width: 80,
            height: 1,
            background: "linear-gradient(to right, #ff6b9d, #c44dff)",
            margin: "10px auto",
          }}
        />
        <p
          style={{
            fontSize: 10,
            color: "rgba(240,230,255,0.5)",
            letterSpacing: "0.12em",
          }}
        >
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .join("  ◆  ")}
        </p>
      </div>
      {data.summary && (
        <p
          style={{
            fontSize: 12,
            color: "rgba(240,230,255,0.8)",
            lineHeight: 1.9,
            textAlign: "center",
            maxWidth: 480,
            margin: "0 auto 28px",
            fontStyle: "italic",
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3
            style={{
              fontSize: 9,
              textTransform: "uppercase",
              letterSpacing: "0.25em",
              color: "#c44dff",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            Work
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                marginBottom: 18,
                padding: "14px",
                background: "rgba(196,77,255,0.07)",
                border: "1px solid rgba(196,77,255,0.2)",
                borderRadius: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <strong style={{ fontSize: 13, color: "#ff6b9d" }}>
                  {e.title}
                </strong>
                <span style={{ fontSize: 10, color: "rgba(240,230,255,0.4)" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 11, color: "#c44dff", marginBottom: 6 }}>
                {e.company}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{
                    fontSize: 11,
                    color: "rgba(240,230,255,0.65)",
                    marginBottom: 2,
                  }}
                >
                  ✦ {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#6b9dff",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <div
                  style={{ fontSize: 12, fontWeight: 600, color: "#f0e6ff" }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 10, color: "rgba(240,230,255,0.5)" }}>
                  {e.school}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "#6b9dff",
                marginBottom: 10,
              }}
            >
              Craft
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "rgba(107,157,255,0.15)",
                    border: "1px solid rgba(107,157,255,0.3)",
                    color: "#6b9dff",
                    borderRadius: 20,
                    padding: "2px 8px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 18. Classic (PREMIUM) ---
function ClassicTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "#fff",
        color: "#111",
        fontFamily: "Times New Roman, serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          borderBottom: "1px solid #999",
          paddingBottom: 14,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <p style={{ fontSize: 11, color: "#555", margin: "6px 0 0" }}>
          {[data.email, data.phone, data.location].filter(Boolean).join(" ∙ ")}
        </p>
      </div>
      {data.summary && (
        <div style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #bbb",
              paddingBottom: 3,
              marginBottom: 8,
            }}
          >
            Objective
          </h3>
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: "#333",
              fontStyle: "italic",
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #bbb",
              paddingBottom: 3,
              marginBottom: 10,
            }}
          >
            Professional Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 12 }}>
                  {e.title}, {e.company}
                </strong>
                <span style={{ fontSize: 11, color: "#666" }}>
                  {e.startDate}
                  {e.endDate ? ` – ${e.endDate}` : ""}
                </span>
              </div>
              <ul style={{ margin: "4px 0 0 14px", padding: 0 }}>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, lineHeight: 1.6, color: "#333" }}
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {data.education.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #bbb",
              paddingBottom: 3,
              marginBottom: 10,
            }}
          >
            Education
          </h3>
          {data.education.map((e, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <strong style={{ fontSize: 12 }}>{e.degree}</strong>
                <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
              </div>
              <span style={{ fontSize: 11, color: "#666" }}>
                {e.startDate}
                {e.endDate ? ` – ${e.endDate}` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              borderBottom: "1px solid #bbb",
              paddingBottom: 3,
              marginBottom: 8,
            }}
          >
            Skills
          </h3>
          <p style={{ fontSize: 12, color: "#333" }}>
            {data.skills.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

// --- 19. Contemporary (PREMIUM) ---
function ContemporaryTemplate({ data }: { data: CVData }) {
  return (
    <div style={{ ...base, background: "#f4f4f0", color: "#2a2a2a" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 30,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 32,
              fontWeight: 800,
              color: "#2a2a2a",
              lineHeight: 1,
            }}
          >
            {data.name || "Your Name"}
          </h1>
          <div
            style={{
              width: 40,
              height: 3,
              background: "#ff5722",
              marginTop: 8,
            }}
          />
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: "#777" }}>
          {[data.email, data.phone, data.location]
            .filter(Boolean)
            .map((c, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 2 }}>
                {c}
              </div>
            ))}
        </div>
      </div>
      {data.summary && (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.8,
            color: "#444",
            borderLeft: "3px solid #ff5722",
            paddingLeft: 12,
            marginBottom: 26,
          }}
        >
          {data.summary}
        </p>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 26 }}>
          <h3
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#ff5722",
              marginBottom: 16,
            }}
          >
            Experience
          </h3>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 18 }}>
              <div
                style={{
                  width: 70,
                  flexShrink: 0,
                  textAlign: "right",
                  fontSize: 10,
                  color: "#ff5722",
                  paddingTop: 2,
                }}
              >
                {e.startDate}
                {e.endDate ? `–${e.endDate}` : ""}
              </div>
              <div
                style={{
                  flex: 1,
                  borderLeft: "2px solid #e0e0e0",
                  paddingLeft: 14,
                }}
              >
                <strong style={{ fontSize: 13 }}>{e.title}</strong>
                <div style={{ fontSize: 11, color: "#777", marginBottom: 5 }}>
                  {e.company}
                </div>
                {e.bullets.filter(Boolean).map((b, bi) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                    key={bi}
                    style={{ fontSize: 11, color: "#555", marginBottom: 2 }}
                  >
                    • {b}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
        {data.education.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#ff5722",
                marginBottom: 10,
              }}
            >
              Education
            </h3>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 12 }}>{e.degree}</div>
                <div style={{ fontSize: 11, color: "#666" }}>{e.school}</div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <h3
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#ff5722",
                marginBottom: 10,
              }}
            >
              Skills
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #ff5722",
                    color: "#ff5722",
                    borderRadius: 20,
                    padding: "3px 10px",
                    fontSize: 10,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 20. Digital (PREMIUM) ---
function DigitalTemplate({ data }: { data: CVData }) {
  return (
    <div
      style={{
        ...base,
        background: "#050510",
        color: "#e0f0ff",
        fontFamily: "Courier New, monospace",
      }}
    >
      <div
        style={{
          borderBottom: "1px solid rgba(0,200,255,0.3)",
          paddingBottom: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "rgba(0,200,255,0.5)",
            marginBottom: 4,
            letterSpacing: "0.15em",
          }}
        >
          {"> IDENTITY.EXE"}
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "#00c8ff",
            textShadow: "0 0 20px rgba(0,200,255,0.5)",
          }}
        >
          {data.name || "Your Name"}
        </h1>
        <p
          style={{
            fontSize: 10,
            color: "rgba(224,240,255,0.5)",
            margin: "6px 0 0",
          }}
        >
          {[data.email, data.phone, data.location].filter(Boolean).join(" │ ")}
        </p>
      </div>
      {data.summary && (
        <div
          style={{
            marginBottom: 22,
            padding: "10px 14px",
            background: "rgba(0,200,255,0.04)",
            border: "1px solid rgba(0,200,255,0.15)",
            borderRadius: 4,
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "rgba(224,240,255,0.8)",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {data.summary}
          </p>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "#00c8ff",
              marginBottom: 12,
            }}
          >
            {"// WORK_HISTORY[]"}
          </div>
          {data.experience.map((e, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static template data
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              key={i}
              style={{
                marginBottom: 14,
                paddingLeft: 14,
                borderLeft: "1px solid rgba(0,200,255,0.2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong style={{ fontSize: 12, color: "#7df9ff" }}>
                  {e.title}
                </strong>
                <span style={{ fontSize: 9, color: "rgba(0,200,255,0.5)" }}>
                  {e.startDate}
                  {e.endDate ? ` - ${e.endDate}` : ""}
                </span>
              </div>
              <div style={{ fontSize: 10, color: "#00c8ff", marginBottom: 5 }}>
                {e.company}
              </div>
              {e.bullets.filter(Boolean).map((b, bi) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={bi}
                  style={{ fontSize: 10, color: "rgba(224,240,255,0.6)" }}
                >
                  $ {b}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {data.education.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "#00c8ff",
                marginBottom: 10,
              }}
            >
              {"// EDUCATION[]"}
            </div>
            {data.education.map((e, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static template data
              <div key={i} style={{ marginBottom: 8 }}>
                <div
                  style={{ fontSize: 11, fontWeight: 700, color: "#7df9ff" }}
                >
                  {e.degree}
                </div>
                <div style={{ fontSize: 9, color: "rgba(224,240,255,0.5)" }}>
                  {e.school} · {e.startDate}
                  {e.endDate ? ` - ${e.endDate}` : ""}
                </div>
              </div>
            ))}
          </div>
        )}
        {data.skills.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "#00c8ff",
                marginBottom: 10,
              }}
            >
              {"// SKILLS[]"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {data.skills.map((s, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static template data
                  key={i}
                  style={{
                    background: "rgba(0,200,255,0.08)",
                    border: "1px solid rgba(0,200,255,0.25)",
                    color: "#7df9ff",
                    borderRadius: 2,
                    padding: "2px 7px",
                    fontSize: 9,
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function CVTemplates({
  template,
  data,
}: { template: number; data: CVData }) {
  const templates = [
    MinimalistTemplate,
    ModernTemplate,
    ExecutiveTemplate,
    CreativeTemplate,
    AcademicTemplate,
    TechTemplate,
    CompactTemplate,
    ElegantTemplate,
    BoldTemplate,
    GradientTemplate,
    TimelineTemplate,
    InfographicTemplate,
    CleanTemplate,
    ProfessionalTemplate,
    StartupTemplate,
    CorporateTemplate,
    ArtisticTemplate,
    ClassicTemplate,
    ContemporaryTemplate,
    DigitalTemplate,
  ];
  const T = templates[template] ?? templates[0];
  return <T data={data} />;
}
