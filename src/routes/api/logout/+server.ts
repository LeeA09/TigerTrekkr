import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {

	const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session

	if (!session) {
		throw error(401, 'Unauthorized')
	}

	const { error } = await locals.supabase.auth.signOut()
	if (error){
		return json({ error: 'Error logging out' }, { status: 400 })
	}

	return json({ success: true })
}
