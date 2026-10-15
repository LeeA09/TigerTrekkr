import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, cookies }) => {

    const { userdata } = await locals.safeGetSession();

    const allowed = cookies.get('can_play');

    if(!allowed){ throw redirect(303, '/difficulty'); }
    cookies.delete('can_play', { path: '/' });

    return { userdata };
};