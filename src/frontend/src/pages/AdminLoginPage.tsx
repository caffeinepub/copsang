import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function AdminLoginPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    if (identity) return;
    try {
      await login();
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    } catch (error: unknown) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-cream border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <p className="font-body text-gold tracking-[0.3em] uppercase text-xs mb-2">
              Copsang
            </p>
            <h1 className="font-display text-3xl font-bold text-navy">
              Admin Portal
            </h1>
            <p className="font-body text-sm text-charcoal/60 mt-2">
              Sign in with Internet Identity to access the admin dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="btn-gold w-full flex items-center justify-center gap-3 py-4 font-body text-sm font-semibold tracking-widest uppercase text-navy disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-gold transition-all"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                Sign In with Internet Identity
              </>
            )}
          </button>

          <p className="font-body text-xs text-charcoal/40 text-center mt-6">
            This portal is restricted to authorized administrators only.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
