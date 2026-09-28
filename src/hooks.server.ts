import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY } from '$env/static/public'
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'


const handleSupabase: Handle = async ({ event, resolve }) => {
  // Initialize the Supabase backend server client
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => event.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          event.cookies.set(name, value, { ...options, path: '/',
		secure: process.env.NODE_ENV === 'production' })
        })
      },
    },
  })

  event.locals.supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
	autoRefreshToken: false,
	persistSession: false
    }
  })

  // Helper method to easily fetch the logged-in user on the backend
  event.locals.safeGetSession = async () => {
    const { data: { user }, error } = await event.locals.supabase.auth.getUser()
    if (error || !user) return { session: null, user: null }
    
    const { data: { session } } = await event.locals.supabase.auth.getSession()

    return { session, user }
  }

  return resolve(event, {
	filterSerializedResponseHeaders(name) {
		return name === 'content-range' || name === 'x-supabase-api-version'
	}
  })
}

export const handle = sequence(handleSupabase)
