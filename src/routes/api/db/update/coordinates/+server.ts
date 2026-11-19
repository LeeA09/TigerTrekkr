import { error, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
    
    const authUser = await locals.safeGetSession?.()

    if (!authUser?.user) { throw error(401, 'Unauthorized') }

    if (authUser?.user.id !== "5d7fff94-5a62-453b-93d0-3a0460f12ecc" && authUser?.user.id !== "cb9c5db1-22b2-41bd-90e3-b754aba822fa"){
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData()
    const newLat = formData.get('newLat')?.toString().trim()
    const newLng = formData.get('newLng')?.toString().trim()
    const locID = formData.get('locationID')?.toString().trim()

    if (!newLat || !newLng) {
        return Response.json({ error: 'New coordinates cannot be empty' }, { status: 200 });
    }

    if (!locID) {
        return Response.json({ error: 'Location ID cannot be empty' }, { status: 200 });
    }

    const { error } = await locals.supabase
        .from('location_image_info')
        .update({ latitude: newLat, longitude: newLng })
        .eq('locationid', locID);

    if (error) {
        return Response.json({ error: error.message }, { status: 200 });
    }

    return Response.json({ success: true });
};
