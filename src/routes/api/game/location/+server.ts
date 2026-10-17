// CURRENTLY NOT USED ANYWHERE

import { json, error } from '@sveltejs/kit';

export async function GET({ locals }) {
    const { data: locations, error: dbError } =
        await locals.supabaseAdmin
            .from('location_image_info')
            .select('locationid, imageurl');

    console.log('Supabase query error:', dbError);
    console.log('Locations returned:', locations?.length);
    console.log('First location:', locations?.[0]);

    if (dbError) {
        console.error('Failed to load locations:', dbError);
        throw error(500, 'Could not load game locations.');
    }

    if (!locations || locations.length === 0) {
        throw error(404, 'No game locations are available.');
    }

    return json({
        locations: locations.map((location) => ({
            locationId: location.locationid,
            imageURL: location.imageurl
        }))
    });
}
