import { json, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {

    const data = await request.json();
    const { locationId } = data

    const { data: rawLeaderboard, error } = await locals.supabase
        .from('round')
        .select(`
            user_data(username),
            score,
            distance,
            lat:guessedlat,
            lng:guessedlong
        `)
        .eq('locationid', locationId)
        .order('distance', { ascending: true })
        .limit(3);

    if (error) {
        console.log('Error fetching leaderboard data:', error);
        return json({ success: false, message: 'Error fetching leaderboard data', error }, { status: 200 });
    }

    const leaderboard = (rawLeaderboard || []).map(item => ({
        id: item.roundid,
        username: item.user_data?.username ?? 'Anonymous',
        score: item.score,
        lat: item.lat,
        lng: item.lng,
        distance: Math.round(item.distance),
    }));

    return json({ success: true, message: 'Leaderboard data retrieved successfully', leaderboard })
}
