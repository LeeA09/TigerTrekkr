import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const allowed = cookies.get('can_play');

    if(!allowed){ throw redirect(303, '/game/difficulty'); }
    cookies.delete('can_play', { path: '/' });

    const { userdata } = await locals.safeGetSession();
    return { userdata };
};