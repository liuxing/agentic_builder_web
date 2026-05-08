import type { ReactNode } from "react";
import { AuthProvider } from "../contexts/AuthContext.tsx";
import { usePrivyAuthBridge } from "../hooks/usePrivyAuthBridge";
import { PrivyAuthProvider } from "./PrivyProvider.tsx";

/**
 * AppProviders — Privy variant.
 *
 * `_optional/auth-privy` overwrites the base `AppProviders` so the rest of
 * the tree (`main.tsx` → `<AppProviders>`) does not need to change when
 * Privy is wired in. The order matters:
 *
 *   <PrivyAuthProvider>     ← gives the tree access to `usePrivy()`
 *     <AuthProvider>        ← stores the verified token + isAuthenticated
 *       {children}
 *     </AuthProvider>
 *   </PrivyAuthProvider>
 */

function PrivyAuthSyncBridge() {
  usePrivyAuthBridge();
  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const hasPrivyAppId = Boolean(import.meta.env.VITE_PRIVY_APP_ID);

  return (
    <PrivyAuthProvider>
      <AuthProvider>
        {hasPrivyAppId ? <PrivyAuthSyncBridge /> : null}
        {children}
      </AuthProvider>
    </PrivyAuthProvider>
  );
}
