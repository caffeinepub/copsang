import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useIsCallerAdmin } from "../../hooks/useQueries";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  // Still loading auth state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!identity) {
    return <Navigate to="/admin" />;
  }

  // Checking admin status
  if (adminLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-3">
            Access Denied
          </h2>
          <p className="font-body text-white/60 mb-6">
            You don't have administrator privileges.
          </p>
          <a
            href="/"
            className="font-body text-xs text-gold tracking-widest uppercase underline"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
