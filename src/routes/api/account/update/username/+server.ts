import { json, error, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals }) => {
    
    const authUser = await locals.safeGetSession?.()

    if (!authUser?.user) { throw error(401, 'Unauthorized') }

    const formData = await request.formData()
    const username = formData.get('newUsername')?.toString().trim()

    if (!username) {
        return json({ error: 'Username cannot be empty' }, { status: 200 });
    }

    const oldUsername = authUser?.userdata.username

    const { error } = await locals.supabase
        .from('user_data')
        .update({ username })
        .eq('userid', authUser.user.id);

    if(error?.code === '23505' || error?.message.toLowerCase().includes('unique')) {
        return json({ error: 'Username already exists.' }, { status: 200 });
    }

    if (error) {
        return json({ error: error.message }, { status: 200 });
    }

    try {
        await sendEmail({
            to: authUser.user.email,
            subject: '⚠ Account username changed ⚠',
            text: `Username has changed for ${oldUsername}.`,
            html: `
				<div style="font-size: 125%; font-family: sans-serif; max-width 600px; margin: 0 auto;">
			   		<h2>Your account username has changed!</h2>
			    	<p>The username for user <strong style="color: #DC562E">${oldUsername}</strong> has been changed to <strong style="color: #DC562E">${username}</strong>.</p>
                    <p style="font-size: 130%; color: #ffffff; border: 4px solid #001D3D; font-weight: bold; background-color: #DC562E; border-radius: 6px; padding: 12px 15px; display: inline-block;">${oldUsername} ➔ ${username}</p>
                    <p>If you did not do this, please contact us immediately!</p>
                    <p>- TigerTrekkr Team</p>
				</div>
                `
        })
    } catch (mailError) {
        console.error('Mail error:', mailError)
        return error(500, 'Account username changed, but Gmail deliver failed')
    }

    return json({ success: true });
};
