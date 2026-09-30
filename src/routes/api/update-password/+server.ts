import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit';
import { sendEmail } from '\$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const session = await locals.getSession?.() || (await locals.sadeGetSession?.())?.session

	if (!session) {
		//throw error(401, 'Unauthorized')
	}

    	const formData = await request.formData()
	const current_password = formData.get('password')?.toString().trim()
	const new_password = formData.get('new_password')?.toString().trim()
	const confirm_new_password = formData.get('new_confirm_password')?.toString().trim()

	if (!current_password || !new_password || !confirm_new_password) {
		return json({ error: 'Username cannot be empty' }, { status: 400 });
	}

	if (new_password !== confirm_new_password){
		return json({ error: 'New passwords do not match' }, { status: 400 })
	}
	
	if (new_password.length < 6) {
		return json({ success: false, error: 'New password must be 6 characters long' }, { status: 400 })
	}

	const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
	if (userError || !user) {
		return json({ success: false, error: 'Unauthorized user session.' }, { status: 401 })
	}

	const { error: signInError } = await locals.supabase.auth.signInWithPassword({ email: user.email, password: current_password })
	if (signInError) {
		return json({ success: false, error: 'Incorrect current password.' }, { status: 400 })
	}

	const { error: updateError } = await locals.supabase.auth.updateUser({ password: new_password })
	if (updateError) {
		return json({ success: false, error: updateError.message }, { status: 400 })
	}

	const username = user.user_metadata?.display_name

	try {
		await sendEmail({
		    to: user.email,
		    subject: '⚠ Account password changed ⚠',
		    text: `Password has changed for ${username}.`,
		    html: `
			<div style="font-family: sans-serif; max-width 600px; margin: 0 auto;">
			    <h2>Account password changed!</h2>
			    <p>The password has been changed for user <strong>${username}</strong>. If you did not do this, please contact us immediately.</p>
			</div>
		    `
		})
	} catch (mailError) {
		console.error('Mail error:', mailError)
		return fail(500, { error: 'Account password changed, but Gmail deliver failed' })
	}
	return json({ success: true, message: 'Password updated successfully.' });
};
