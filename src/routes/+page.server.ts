import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const { data: leaderboard, error } = await locals.supabase
        .from('user')
        .select('username, totalscore')
        .order('totalscore', { ascending: false })
        .limit(10);

    if (error) {
        console.error(error);
        return { leaderboard: [] };
    }

    return { leaderboard };
};