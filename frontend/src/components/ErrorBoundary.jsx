import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "40px 24px", textAlign: "center", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: "#0f172a" }}>Something went wrong.</h1>
          <p style={{ color: "#64748b", marginBottom: 32, maxWidth: 500 }}>
            We're sorry, but an unexpected error occurred. Please try refreshing the page or going back to the dashboard.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <button 
              onClick={() => window.location.reload()}
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 16 }}
            >
              Refresh Page
            </button>
            <Link 
              to="/dashboard"
              onClick={() => this.setState({ hasError: false })}
              style={{ background: "#fff", color: "#1e293b", border: "1px solid #e2e8f0", padding: "12px 24px", borderRadius: 12, fontWeight: 600, cursor: "pointer", fontSize: 16, textDecoration: "none" }}
            >
              Go to Dashboard
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div style={{ marginTop: 40, padding: 20, background: "#f1f5f9", borderRadius: 12, textAlign: "left", maxWidth: 800, overflow: "auto" }}>
              <p style={{ fontWeight: 700, color: "#e11d48", marginBottom: 8 }}>{this.state.error?.toString()}</p>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
