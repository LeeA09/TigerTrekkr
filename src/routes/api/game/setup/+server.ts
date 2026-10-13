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
            .from('images')
            .getPublicUrl(location[0].imageurl);

    return json({ success: true, image_url: data.publicUrl, image_id: location[0].locationid });
}