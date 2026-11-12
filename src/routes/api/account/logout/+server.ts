import { error, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ locals }) => {

	const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session

	if (!session) { throw error(401, 'Unauthorized') }

	const { error } = await locals.supabase.auth.signOut()
	if (error){ return Response.json({ error: 'Error logging out' }, { status: 400 }) }

	return Response.json({ success: true })
}
