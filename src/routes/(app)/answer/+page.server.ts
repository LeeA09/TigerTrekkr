import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { userdata } = await locals.safeGetSession();

    return { userdata };
};