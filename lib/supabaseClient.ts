import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY } from "@/lib/env";

let _supabase: SupabaseClient | null = null;

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing env var ${name}. Set ${name} in .env.local`);
  }
  return value;
}

export function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL", NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", NEXT_PUBLIC_SUPABASE_ANON_KEY);

  _supabase = createClient(url, anonKey);
  return _supabase;
}

export default getSupabaseClient;