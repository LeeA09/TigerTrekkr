import { json, error, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals, url }) => {
	const { session, userdata } = await locals.safeGetSession?.()

	if (!session) { console.log("failed here"); throw error(401, 'Unauthorized') }

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
				<div style="font-size: 125%; font-family: sans-serif; max-width 600px; margin: 0 auto;">
			   		<h2>Your account password has changed!</h2>
			    	<p>The password for user <strong style="color: #DC562E">${username}</strong> has been changed.</p>
					<p>If you did not do this, please contact us immediately!</p>
					<p>- TigerTrekkr Team</p>
				</div>
		    	`
		})
	} catch (mailError) {
		console.error('Mail error:', mailError)
		return error(500, 'Account password changed, but Gmail deliver failed')
	}
	return json({ success: true, message: 'Password updated successfully.' });
};
