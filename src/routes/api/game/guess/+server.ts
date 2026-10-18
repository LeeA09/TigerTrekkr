import { json, error } from '@sveltejs/kit';

function haversineDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371000;
    const toRadians = (degrees) => degrees * Math.PI / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * earthRadius *
        Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Calculates the score based on distance, time taken, and difficulty level.
function calculateScore(distance: number, seconds: number, difficulty: string) {
    const settings = {
        easy: { multiplier: 1.0, maxScore: 3000 },
        medium: { multiplier: 1.1, maxScore: 4000 },
        hard: { multiplier: 1.2, maxScore: 5000 }
    }
    const config = settings[difficulty as keyof typeof settings];
    if (!config) {
        throw error(400, 'Invalid difficulty.');
    }
    const distanceScore = config.maxScore * Math.exp(-0.0014 * distance);
    const timePenalty = 10 * seconds;
    const rawScore = (distanceScore - timePenalty) * config.multiplier;

    return Math.round(Math.max(0, Math.min(config.maxScore, rawScore)));
}

export async function POST({ request, locals }) {
    const body = await request.json();

    const locationId = Number(body.locationId);
    const guessedLat = Number(body.guessedLat);
    const guessedLng = Number(body.guessedLng);
    const seconds = Number(body.seconds);
    const difficulty = String(body.difficulty ?? '').toLowerCase();

    if (
        !Number.isInteger(locationId) ||
        !Number.isFinite(guessedLat) ||
        guessedLat < -90 || guessedLat > 90 ||
        !Number.isFinite(guessedLng) ||
        guessedLng < -180 || guessedLng > 180 ||
        !Number.isFinite(seconds) ||
        seconds < 0 || seconds > 3600
    ) {
        throw error(400, 'Invalid guess data.');
    }

    const { data: location, error: locationError } =
        await locals.supabaseAdmin
            .from('location_image_info')
            .select(
                'locationid, latitude, longitude, description, locationname'
            )
            .eq('locationid', locationId)
            .single();

    if (locationError || !location) {
        throw error(404, 'Game location not found.');
    }
    
    const distance = haversineDistance(
        guessedLat,
        guessedLng,
        location.latitude,
        location.longitude
    );

    const score = calculateScore(distance, seconds, difficulty);

    // Only link the round to a registered profile if its ID matches
    // the authenticated Supabase Auth user's ID.
    const { user } = await locals.safeGetSession();
    if(user){
        // GET USER PROFILE
        const { data: profile, error: userError } = await locals.supabaseAdmin
            .from('user_data')
            .select('*')
            .eq('userid', user.id)
            .maybeSingle();

        if(!profile || userError){
            console.error('Failed to find user:', userError);
            throw error(500, 'Could not find user.');
        }

        // SAVE NEW ROUND TO DATABASE
        const { error: saveError } =
            await locals.supabaseAdmin
                .from('round')
                .insert({
                    userid: profile.userid,
                    guessedlat: guessedLat,
                    guessedlong: guessedLng,
                    distance,
                    timetaken: Math.floor(seconds),
                    difficulty,
                    score,
                    locationid: locationId
                })
                .select('roundid')
                .single();

        if (saveError) {
            console.error('Failed to save round:', saveError);
            throw error(500, 'Could not save your round.');
        }

        // UPDATE USER TOTAL SCORE
        const { error: updateError } =
            await locals.supabaseAdmin
                .from('user_data')
                .update({ totalscore: Number(profile.totalscore) + score })
                .eq('userid', profile.userid);

        if (updateError) {
            console.error('Failed to update user total:', updateError);
        }
    }    

    return json({
        locationId: location.locationid,
        guessedLocation: {
            lat: guessedLat,
            lng: guessedLng
        },
        correctLocation: {
            lat: location.latitude,
            lng: location.longitude
        },
        description: location.description,
        locationName: location.locationname,
        distance: Math.round(distance),
        seconds: Math.floor(seconds),
        difficulty,
        score
    });
}
