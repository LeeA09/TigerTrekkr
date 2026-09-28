import { SupabaseClient, Session, User } from '@supabase/supabase-js'

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient
      supabaseAdmin: SupabaseClient
      safeGetSession: () => Promise<{ session: Session | null; user: User | null }>
    }
    // interface PageData {}
    // interface Error {}
    // interface Platform {}
  }
}

export {}
