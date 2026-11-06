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
            .from('image_tiles')
            .getPublicUrl(loc.imageurl);

        // USE IF ON LOCAL SERVER
        const trueUrl = `${data.publicUrl}/{z}/{f}/{y}/{x}.jpg`;

        // USE IF ON PROD SERVER
        // const trueUrl = `/api/game/image?url=${encodeURIComponent(data.publicUrl)}`
        
        return {
            image_id: loc.locationid,
            tile_url_template: trueUrl
        }
    })

    return Response.json({ success: true, locations: formattedLocations });
}