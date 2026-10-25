import { json, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {

    const data = await request.json();
    const { locationId, roundId } = data

    const { data: rawLeaderboard, error } = await locals.supabase
        .from('round')
        .select(`
            roundid,
            user_data(username),
            score,
            lat:guessedlat,
            lng:guessedlong
        `)
        .eq('locationid', locationId)
        .order('score', { ascending: false })
        .limit(3); // THIS CAN BE CHANGED IF WE WANT TO LIST MORE THAN 3 LEADERS

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
        isCurrGuess: item.roundid === roundId
    }));

    return json({ success: true, message: 'Leaderboard data retrieved successfully', leaderboard })
}