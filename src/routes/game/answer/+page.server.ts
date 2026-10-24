import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    const allowed = cookies.get('from_game');

    if(!allowed){ throw redirect(303, '/'); }
    cookies.delete('from_game', { path: '/' });

    const { userdata } = await locals.safeGetSession();
    return { userdata };
};
