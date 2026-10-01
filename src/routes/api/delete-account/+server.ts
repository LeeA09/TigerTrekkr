import { json, error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

const supabaseAdmin = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST({ locals }) {
    const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session;
    
    if (!session) { throw error(401, 'Unauthorized'); }

    const userId = session.user.id;

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) { throw error(500, deleteError.message); }

    await locals.supabase.auth.signOut();

    return json({ success: true });
}
