import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {

    const { user } = await locals.safeGetSession();

    // If unauthenticated, redirect to home page
    if(!user){ throw redirect(303, '/'); }

    // If not an admin, redirect to home page
    if (user?.id !== "5d7fff94-5a62-453b-93d0-3a0460f12ecc" && user?.id !== "cb9c5db1-22b2-41bd-90e3-b754aba822fa"){
        throw redirect(303, '/');
    }


    // If authenticated and an admin, return array of location data for editing
    const { data, error: dbError } = await locals.supabase
        .from('location_image_info')
        .select('*');

    if (dbError) {
        console.error(dbError);
        throw error(500, 'Could not load game locations.');
    }

    if (!data || data.length === 0) {
        throw error(404, 'No game locations are available.');
    }

    const locations = data.map((loc) => {
        const { data } = locals.supabase
            .storage
            .from('image_tiles')
            .getPublicUrl(loc.imageurl);

        const trueUrl = `${data.publicUrl}/{z}/{f}/{y}/{x}.jpg`;
        
        return {
            locationID: loc.locationid,
            imageUrl_template: trueUrl,
            correctLocation: {
                lat: loc.latitude,
                lng: loc.longitude
            },
            description: loc.description
        }
    })

    return { locations };
};