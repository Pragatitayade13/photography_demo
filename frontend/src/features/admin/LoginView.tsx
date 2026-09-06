import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, Camera, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../auth/hooks/useAuth";

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin12345");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/admin";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      const msg = err.error?.message || err.message || "Invalid email or password";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 relative">
      {/* Return to Public Site */}
      <Link
        to="/"
        className="absolute top-8 left-8 inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-secondary hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Showcase</span>
      </Link>

      <div className="w-full max-w-md bg-surface border border-surface-border rounded-xl p-8 space-y-8 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-surface-raised border border-surface-border text-accent mb-2">
            <Camera className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-light text-primary">
            Studio CMS Sign In
          </h2>
          <p className="text-xs text-secondary">
            Enter authorized credentials to manage portfolio and inquiries.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-danger/10 border border-danger/20 rounded-md text-danger text-xs text-center font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-secondary/60 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="photographer@studio.com"
                className="w-full bg-surface-raised border border-surface-border rounded-md pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-secondary/60 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-raised border border-surface-border rounded-md pl-10 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-raised/60 border border-surface-border/60 rounded text-[11px] text-secondary">
            <span className="text-accent font-semibold">Demo Credentials:</span>{" "}
            admin@example.com / admin12345
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-accent text-background font-medium text-xs uppercase tracking-widest hover:bg-accent-hover transition-colors rounded-md mt-4 disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Studio"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
