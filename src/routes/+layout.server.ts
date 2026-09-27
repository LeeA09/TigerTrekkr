import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies, locals: { safeGetSession } }) => {
  const { session, user } = await safeGetSession()
  
  return {
    session,
    user,
    
    cookies: cookies.getAll()
  }
}
