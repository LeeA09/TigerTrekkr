import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
    
    const authUser = await locals.safeGetSession?.()

    if (!authUser?.user) { throw error(401, 'Unauthorized') }

    const formData = await request.formData()
    const username = formData.get('newUsername')?.toString().trim()

    if (!username) {
        return json({ error: 'Username cannot be empty' }, { status: 400 });
    }

    const { error } = await locals.supabase
        .from('user_data')
        .update({ username })
        .eq('userid', authUser.user.id);

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    return json({ success: true });
};
