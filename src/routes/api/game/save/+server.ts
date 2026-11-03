import { error } from '@sveltejs/kit';

export async function POST({ request, locals }) {
    const body = await request.json();
    const { rounds, totalScore } = body;

    // Only link the round to a registered profile if its ID matches
    // the authenticated Supabase Auth user's ID.
    const { user, userdata } = await locals.safeGetSession();
    if(!user || !userdata){
        throw error(401, 'User not authenticated or missing data.');
    }

    const formattedRounds = rounds.map(round => ({
        userid: user?.id,
        locationid: round.locationId,
        guessedlat: round.guessedLocation?.lat,
        guessedlong: round.guessedLocation?.lng,
        distance: round.distance,
        seconds: round.seconds,
        difficulty: round.difficulty,
        score: round.score
    }));

    const { data, error: roundError } = await locals.supabaseAdmin
        .from('round')
        .insert(formattedRounds)
        .select('roundid');

    if (roundError) {
        console.error('Error inserting rounds:', roundError.message);
        throw error(500, 'Could not save your round.');
    }

    const { error: sessionError } = await locals.supabaseAdmin
        .from('session')
        .insert({
            userid: user?.id,
            game_score: totalScore,
            gameids: data.map(round => round.roundid)
        })
        .select();

    if (sessionError) {
        console.error('Error inserting session:', sessionError.message);
        throw error(500, 'Could not save your session.');
    }
    
    // UPDATE USER TOTAL SCORE
    const { error: scoreError } =
        await locals.supabaseAdmin
            .from('user_data')
            .update({ totalscore: Number(userdata.totalscore) + totalScore })
            .eq('userid', user.id);

    if (scoreError) {
        console.error('Failed to update user total:', scoreError.message);
        throw error(500, 'Could not save your game score.');
    }

    return Response.json({ success: true });
}