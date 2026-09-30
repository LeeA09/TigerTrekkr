import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const session = await locals.getSession?.() || (await locals.sadeGetSession?.())?.session

	if (!session) {
		//throw error(401, 'Unauthorized')
	}

	const rawData = await request.formData()
    	

	// FIX FORM/JSON PARSER

	const current_password = formData.get('current-password')?.toString().trim()
	const new_password = formData.get('new-password')?.toString().trim()
	const confirm_new_password = formData.get('new-confirm-password')?.toString().trim()

	console.log(Object.fromEntries(formData))

	if (!current_password || !new_password || !confirm_new_password) {
		return json({ error: 'Username cannot be empty' }, { status: 400 });
	}

	console.log(current_password)

	if (new_password !== confirm_new_password){
		return json({ error: 'New passwords do not match' }, { status: 400 })
	}

	console.log(new_password !== confirm_new_password)

	// IMPLEMENT SUPABASE UPDATE HERE

	//if (error) {
	//	return json({ error: error.message }, {status: 400});
	//}

	return json({ success: true });
};
