import { json, error } from '@sveltejs/kit';

export async function GET({ locals }) {
    const { data: locations, error: dbError } = await locals.supabase
        .rpc('get_random_rows', {
            table_name: 'location_image_info',
            row_count: 3
        })

    if (dbError) {
        console.error(dbError);
        throw error(500, 'Could not load game locations.');
    }

    if (!locations || locations.length === 0) {
        throw error(404, 'No game locations are available.');
    }

    const formattedLocations = locations.map((loc) => {
        const { data } = locals.supabase
            .storage
            .from('location_images')
            .getPublicUrl(loc.imageurl);

        // USE IF ON LOCAL SERVER
        const trueUrl = data.publicUrl;

        // USE IF ON PROD SERVER
        // const truUrl = `/api/game/image?url=${encodeURIComponent(data.publicUrl)}`
        
        return {
            image_id: loc.locationid,
            image_url: trueUrl
        }
    })

    return json({ success: true, locations: formattedLocations });
}

// SHUFFLE FUNCTION MOVED FROM PLAY PAGE
// function fisher_yates_shuffle(locations) {
//     const shuffled = [...locations];
//     for (let i = shuffled.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//     }
//     return shuffled;
// }
