import { error } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';

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
        const trueUrl = `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/image_tiles/${loc.imageurl}/{z}/{f}/{y}/{x}.jpg`;
        
        return {
            image_id: loc.locationid,
            tile_url_template: trueUrl
        }
    })

    return Response.json({ success: true, locations: formattedLocations });
}
