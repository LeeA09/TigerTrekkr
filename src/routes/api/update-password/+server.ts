import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '\$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const { session, userdata } = await locals.safeGetSession?.()

	if (!session) { console.log("failed here"); throw svelteError(401, 'Unauthorized') }

	const formData = await request.formData()
	const currentPassword = formData.get('password')?.toString().trim()
	const newPassword = formData.get('newPassword')?.toString().trim()
	const confirmNewPassword = formData.get('confirmNewPassword')?.toString().trim()

	if (!currentPassword || !newPassword || !confirmNewPassword) {
		return json({ error: 'Fields cannot be empty' }, { status: 200 });
	}

	if (newPassword !== confirmNewPassword){
		return json({ error: 'New passwords do not match' }, { status: 200 })
	}

	const { data: { user }, error: userError } = await locals.supabase.auth.getUser();
	if (userError || !user) {
		return json({ success: false, error: 'Unauthorized user session.' }, { status: 401 })
	}

	const { error: signInError } = await locals.supabase.auth.signInWithPassword({ email: user.email, password: currentPassword })
	if (signInError) {
		return json({ success: false, error: 'Incorrect current password.' }, { status: 200 })
	}

	const { error: updateError } = await locals.supabase.auth.updateUser({ password: newPassword })
	if (updateError) {
		return json({ success: false, error: updateError.message }, { status: 200 })
	}

	const username = userdata?.username || 'user'

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
		return svelteError(500, 'Account password changed, but Gmail deliver failed')
	}
	return json({ success: true, message: 'Password updated successfully.' });
};
