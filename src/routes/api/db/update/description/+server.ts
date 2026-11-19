import { error, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
    
    const authUser = await locals.safeGetSession?.()

    if (!authUser?.user) { throw error(401, 'Unauthorized') }

    if (authUser?.user.id !== "5d7fff94-5a62-453b-93d0-3a0460f12ecc" && authUser?.user.id !== "cb9c5db1-22b2-41bd-90e3-b754aba822fa"){
        return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData()
    const description = formData.get('newDescription')?.toString().trim()
    const locID = formData.get('locationID')?.toString().trim()

    if (!description) {
        return Response.json({ error: 'New description cannot be empty' }, { status: 200 });
    }

    if (!locID) {
        return Response.json({ error: 'Location ID cannot be empty' }, { status: 200 });
    }

    const { error } = await locals.supabase
        .from('location_image_info')
        .update({ description })
        .eq('locationid', locID);

    if (error) {
        return Response.json({ error: error.message }, { status: 200 });
    }

    return Response.json({ success: true });
};
