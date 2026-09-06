"use client";

import { useEffect, useState, useCallback } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  const signInWithEmail = useCallback(async (email: string, redirectPath = "/account") => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Accounts aren't set up yet." };

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/confirm?next=${encodeURIComponent(redirectPath)}`
            : undefined,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return {
    user,
    loading,
    isConfigured: isSupabaseConfigured,
    signInWithEmail,
    signOut,
  };
}
