import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const publicLinks = [
  ["Home", "/"],
  ["About", "/about"],
  ["Services", "/services"],
  ["Contact", "/contact"],
];

const privateLinks = [
  ["Dashboard", "/dashboard"],
  ["Request Blood", "/request-blood"],
  ["Donate Blood", "/donate-blood"],
  ["Ambulance", "/ambulance"],
  ["Hospitals", "/hospitals"],
  ["Volunteers", "/volunteers"],
  ["Notifications", "/dashboard/notifications"],
  ["Profile", "/dashboard/profile"],
];

export default function Navbar({ isLoggedIn = false, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = isLoggedIn ? privateLinks : publicLinks;

  const handleNavigate = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    onLogout?.();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => handleNavigate(isLoggedIn ? "/dashboard" : "/")}
          className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-xl font-extrabold text-transparent"
        >
          LifeLink
        </button>

        <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-800/60 md:flex">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow"
                    : "text-slate-600 hover:bg-slate-100 hover:text-rose-500 dark:text-slate-300 dark:hover:bg-slate-700/70"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            Theme
          </button>
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Login
            </NavLink>
          )}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 md:hidden"
          >
            Menu
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 pb-3 md:hidden">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-rose-500 to-pink-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
