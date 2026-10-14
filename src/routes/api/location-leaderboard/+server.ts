import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {

    const data = await request.json();
    const { data: rawLeaderboard, error } = await locals.supabase
        .from('round')
        .select(`
            user_data(username),
            score,
            lat:guessedlat,
            lng:guessedlong
        `)
        .eq('locationid', data.locationId)
        .order('score', { ascending: false })
        .limit(3); // THIS CAN BE CHANGED IF WE WANT TO LIST MORE THAN 3 LEADERS

    if (error) {
        console.log('Error fetching leaderboard data:', error);
        return json({ success: false, message: 'Error fetching leaderboard data', error }, { status: 500 });
    }

    const leaderboard = (rawLeaderboard || []).map(item => ({
        username: item.user_data?.username ?? 'Anonymous',
        score: item.score,
        lat: item.lat,
        lng: item.lng
    }));

    return json({ success: true, message: 'Leaderboard data retrieved successfully', leaderboard })
}