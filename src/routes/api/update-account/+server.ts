import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    
    const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session

    if (!session) {
	throw error(401, 'Unauthorized')
    }

    const formData = await request.formData()
    const username = formData.get('new_username')?.toString().trim()

    if (!username) {
        return json({ error: 'Username cannot be empty' }, { status: 400 });
    }

    const { error } = await locals.supabase.auth.updateUser({
        data: { display_name: username }
    });

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true });
};
