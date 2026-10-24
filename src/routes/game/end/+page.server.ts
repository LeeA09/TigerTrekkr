import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const allowed = cookies.get('game_played');

    if(!allowed){ throw redirect(303, '/game/difficulty'); }
    cookies.delete('game_played', { path: '/' });

    const { userdata } = await locals.safeGetSession();
    return { userdata };
};