import type { ReactNode } from "react";
import { useSetSession } from "@/store/session";
import { useEffect } from "react";
import supabase from "@/lib/supabase";
import { useIsSessionLoaded } from "@/store/session";
import GlobalLoader from "@/components/global-loader";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const setSession = useSetSession();
  const isSessionLoaded = useIsSessionLoaded();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  if (!isSessionLoaded) return <GlobalLoader />;
  return children;
}
