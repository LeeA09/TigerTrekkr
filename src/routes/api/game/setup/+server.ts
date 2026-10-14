import { json, error } from '@sveltejs/kit';
import { sessionLocations } from '$lib/stores/game';

export async function GET({ locals }) {
    const { data: location, error: dbError } = await locals.supabase
        .rpc('get_random_rows', {
            table_name: 'location_image_info',
            row_count: 1
        })

    if (dbError) {
        console.error(dbError);
        throw error(500, 'Could not load game locations.');
    }

    if (!location || location.length === 0) {
        throw error(404, 'No game locations are available.');
    }

    const { data } = locals.supabase
            .storage
            .from('location_images')
            .getPublicUrl(location[0].imageurl);


    // THIS IS ONLY FOR PROD SERVER, SINCE WE CANNOT ACCESS THE PUBLIC URL DIRECTLY FROM THE CLIENT
    // const proxyUrl = `/api/game/image?url=${encodeURIComponent(data.publicUrl)}`
    // return json({ success: true, image_url: proxyUrl, image_id: location[0].locationid });

    // THIS IS FOR LOCAL DEV SERVER, SINCE WE CAN ACCESS THE PUBLIC URL DIRECTLY FROM THE CLIENT
    return json({ success: true, image_url: data.publicUrl, image_id: location[0].locationid });
}
