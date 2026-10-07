import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '\$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session

	if (!session) { throw error(401, 'Unauthorized') }

	const formData = await request.formData()
	const currentPassword = formData.get('password')?.toString().trim()
	const newPassword = formData.get('newPassword')?.toString().trim()
	const confirmNewPassword = formData.get('confirmNewPassword')?.toString().trim()

	if (!currentPassword || !newPassword || !confirmNewPassword) {
		return json({ error: 'Username cannot be empty' }, { status: 400 });
	}

	if (newPassword !== confirmNewPassword){
		return json({ error: 'New passwords do not match' }, { status: 400 })
	}
	
	if (newPassword.length < 6) {
		return json({ success: false, error: 'New password must be 6 characters long' }, { status: 400 })
	}

	const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
	if (userError || !user) {
		return json({ success: false, error: 'Unauthorized user session.' }, { status: 401 })
	}

	const { error: signInError } = await locals.supabase.auth.signInWithPassword({ email: user.email, password: currentPassword })
	if (signInError) {
		return json({ success: false, error: 'Incorrect current password.' }, { status: 400 })
	}

	const { error: updateError } = await locals.supabase.auth.updateUser({ password: newPassword })
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
