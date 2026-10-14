import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {

    const { userdata } = await locals.safeGetSession();

    return { userdata };
};