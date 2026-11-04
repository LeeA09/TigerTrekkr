import { type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {

    const data = await request.json();
    const { locationId, userGuess, user } = data

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
        return Response.json({ success: false, message: 'Error fetching leaderboard data', error }, { status: 200 });
    }

    let leaderboard;

    // DONT INCLUDE SUBMITTED PLAYER GUESS ON LEADERBOARD IF WAS SKIPPED OR TIMED OUT
    if(userGuess.score) {
        leaderboard = [
            ...(rawLeaderboard || []).map(item => ({
                username: item.user_data?.username ?? 'Anonymous', 
                score: item.score,
                lat: item.lat,
                lng: item.lng,
                distance: item.distance,
                isCurrGuess: false,
            })),
            {
                username: user ?? null,
                score: userGuess?.score ?? 0,
                lat: userGuess?.lat ?? 0,
                lng: userGuess?.lng ?? 0,
                distance: userGuess?.distance ?? 0,
                isCurrGuess: true,
            }
        ]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(item => ({
            ...item,
            distance: Math.floor(item.distance),
        }))
    } else {
        leaderboard = (rawLeaderboard || []).map(item => ({
            username: item.user_data?.username ?? 'Anonymous', 
            score: item.score,
            lat: item.lat,
            lng: item.lng,
            distance: Math.floor(item.distance),
            isCurrGuess: false,
        }))
    }

    return Response.json({ success: true, message: 'Leaderboard data retrieved successfully', leaderboard })
}
