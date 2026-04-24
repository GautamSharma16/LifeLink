import { useState, useEffect } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentRole } from "../lib/auth";

const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const privateLinks = [
  { label: "Dashboard", to: "/dashboard", roles: ["user", "volunteer", "hospital", "ambulance_driver", "admin"] },
  { label: "Request", to: "/request-blood", roles: ["user", "hospital", "admin"] },
  { label: "Donate", to: "/donate-blood", roles: ["user", "volunteer", "admin"] },
  { label: "Ambulance", to: "/ambulance", roles: ["user", "ambulance_driver", "hospital", "admin"] },
  { label: "Hospitals", to: "/hospitals", roles: ["user", "hospital", "admin"] },
  { label: "Volunteers", to: "/volunteers", roles: ["user", "volunteer", "admin"] },
  { label: "Alerts", to: "/notifications", roles: ["user", "volunteer", "hospital", "ambulance_driver", "admin"] },
  { label: "Hospital Setup", to: "/hospital-registration", roles: ["hospital"] },
  { label: "Profile", to: "/profile", roles: ["user", "volunteer", "hospital", "ambulance_driver", "admin"] },
];

export default function Navbar({ isLoggedIn = false, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = isLoggedIn ? getCurrentRole() : null;
  const links = isLoggedIn ? privateLinks.filter(l => l.roles.includes(role)) : publicLinks;

  useEffect(() => {
    const savedDark = localStorage.getItem("ll-dark") === "true";
    setDark(savedDark);
    document.documentElement.classList.toggle("dark", savedDark);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ll-dark", next);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: scrolled
          ? "rgba(255,255,255,0.92)"
          : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled
          ? "1px solid rgba(226,232,240,0.8)"
          : "1px solid transparent",
        transition: "all 0.3s ease",
        width: "100%",
        boxSizing: "border-box",
      }}
      className="dark-nav"
    >
      <style>{`
        .dark .dark-nav {
          background: ${scrolled ? "rgba(15,23,42,0.92)" : "rgba(15,23,42,0.75)"} !important;
          border-bottom: ${scrolled ? "1px solid rgba(51,65,85,0.7)" : "1px solid transparent"} !important;
        }
        .nav-link { text-decoration: none; border-radius: 12px; padding: 7px 14px; font-size: 14px; font-weight: 500; transition: all 0.2s; color: #475569; }
        .nav-link:hover { background: #f1f5f9; color: #e11d48; }
        .nav-link.active { background: linear-gradient(135deg,#e11d48,#db2777); color: #fff; }
        .dark .nav-link { color: #94a3b8; }
        .dark .nav-link:hover { background: #1e293b; color: #e11d48; }
        .dark .nav-link.active { background: linear-gradient(135deg,#e11d48,#db2777); color: #fff; }
        @font-face {}
        @media(max-width:900px){ .desk-nav { display:none!important; } }
        @media(min-width:901px){ .mob-toggle { display:none!important; } }
      `}</style>

      <nav
        style={{
          maxWidth: 1280,
          width: "100%",
          margin: "0 auto",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          boxSizing: "border-box",
        }}
      >
        {/* Logo */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 24,
            fontWeight: 700,
            background: "linear-gradient(135deg,#e11d48,#db2777)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textDecoration: "none",
            letterSpacing: "-0.5px",
            flexShrink: 0,
          }}
        >
          LifeLink
        </Link>

        {/* Desktop Nav */}
        <div
          className="desk-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(248,250,252,0.8)",
            border: "1px solid rgba(226,232,240,0.7)",
            borderRadius: 16,
            padding: "4px 6px",
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <button
            onClick={toggleDark}
            style={{
              border: "1px solid rgba(226,232,240,0.8)",
              background: "rgba(248,250,252,0.8)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 14,
              cursor: "pointer",
              fontFamily: "'DM Sans',sans-serif",
              color: "#475569",
              transition: "all 0.2s",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>

          {isLoggedIn ? (
            <button
              onClick={() => { onLogout?.(); }}
              style={{
                background: "linear-gradient(135deg,#e11d48,#db2777)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              style={{
                background: "linear-gradient(135deg,#10b981,#059669)",
                color: "#fff",
                borderRadius: 10,
                padding: "8px 16px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Login
            </NavLink>
          )}

          <button
            className="mob-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              border: "1px solid rgba(226,232,240,0.8)",
              background: "rgba(248,250,252,0.8)",
              borderRadius: 10,
              padding: "8px 12px",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", borderTop: "1px solid rgba(226,232,240,0.5)" }}
          >
            <div style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                  style={{ display: "block" }}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
