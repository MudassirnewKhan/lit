'use client';

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SessionSync() {
  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      // If the 'logout-event' key changes in localStorage...
      if (event.key === "logout-event") {
        // ...force a logout on this tab too
        signOut({ redirect: true, callbackUrl: "/" });
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  return null; // It renders nothing
}