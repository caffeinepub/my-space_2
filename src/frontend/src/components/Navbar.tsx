import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuthModal } from "../context/AuthModalContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const { identity, clear } = useInternetIdentity();
  const { openModal } = useAuthModal();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks: [string, string][] = [
    ["/", "Dashboard"],
    ["/cv-forge", "CV Space"],
    ["/oracle", "Learning Space"],
    ["/cover-letter", "Cover Letter"],
    ["/applications", "Applications"],
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "10px 16px",
      }}
    >
      <nav
        className="glass"
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
          data-ocid="nav.logo.button"
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            aria-label="My Space logo"
            role="img"
          >
            <circle
              cx="13"
              cy="13"
              r="5"
              fill="rgba(45,227,230,0.2)"
              stroke="#2DE3E6"
              strokeWidth="1.5"
            />
            <ellipse
              cx="13"
              cy="13"
              rx="12"
              ry="4.5"
              stroke="#2DE3E6"
              strokeWidth="1.2"
              fill="none"
              opacity="0.6"
            />
          </svg>
          <span
            className="orbitron neon-cyan"
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
            }}
          >
            MY SPACE
          </span>
        </button>

        {/* Desktop nav */}
        <div
          className="hide-mobile"
          style={{
            display: "flex",
            gap: 2,
            flexWrap: "nowrap",
            overflow: "hidden",
          }}
        >
          {navLinks.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              style={{
                padding: "6px 12px",
                borderRadius: 50,
                textDecoration: "none",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#A7B2C8",
                background: "transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              activeProps={{
                style: {
                  color: "#070A14",
                  background: "#2DE3E6",
                },
              }}
              data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/profile"
              style={{
                padding: "6px 12px",
                borderRadius: 50,
                textDecoration: "none",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                fontSize: "0.88rem",
                color: "#A7B2C8",
                background: "transparent",
                transition: "all 0.2s",
              }}
              activeProps={{
                style: { color: "#070A14", background: "#2DE3E6" },
              }}
              data-ocid="nav.profile.link"
            >
              Profile
            </Link>
          )}
        </div>

        {/* Auth + Mobile */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            className={isAuthenticated ? "btn-violet" : "btn-cyan"}
            style={{ fontSize: "0.65rem", padding: "0.5rem 1.2rem" }}
            onClick={isAuthenticated ? clear : () => openModal("login")}
            data-ocid="nav.auth.button"
          >
            {isAuthenticated ? "LOGOUT" : "LOGIN"}
          </button>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              display: "none",
              background: "none",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 8,
              color: "#EAF2FF",
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
            className="show-mobile"
            data-ocid="nav.mobile.toggle"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          className="glass"
          style={{
            maxWidth: 1060,
            margin: "4px auto 0",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {navLinks.map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#A7B2C8",
                background: "transparent",
              }}
              activeProps={{
                style: { color: "#2DE3E6", background: "rgba(45,227,230,0.1)" },
              }}
              data-ocid={`nav.mobile.${label.toLowerCase().replace(/ /g, "_")}.link`}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                textDecoration: "none",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 600,
                fontSize: "1rem",
                color: "#A7B2C8",
                background: "transparent",
              }}
              activeProps={{
                style: { color: "#2DE3E6", background: "rgba(45,227,230,0.1)" },
              }}
              data-ocid="nav.mobile.profile.link"
            >
              Profile
            </Link>
          )}
          <button
            type="button"
            className={isAuthenticated ? "btn-violet" : "btn-cyan"}
            style={{
              fontSize: "0.65rem",
              padding: "0.5rem 1.2rem",
              marginTop: 4,
            }}
            onClick={() => {
              setMobileOpen(false);
              if (isAuthenticated) clear();
              else openModal("login");
            }}
            data-ocid="nav.mobile.auth.button"
          >
            {isAuthenticated ? "LOGOUT" : "LOGIN"}
          </button>
        </div>
      )}
    </header>
  );
}
