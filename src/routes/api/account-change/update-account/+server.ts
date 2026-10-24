import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '\$lib/server/mailer'

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
                <div style="font-family: sans-serif; max-width 600px; margin: 0 auto;">
                    <h2>Account username changed!</h2>
                    <p>
                        The username has been changed for user <strong>${oldUsername}</strong> to <strong>${username}</strong>.
                        If you did not do this, please contact us immediately.
                    </p>
                </div>
                `
        })
    } catch (mailError) {
        console.error('Mail error:', mailError)
        return svelteError(500, 'Account username changed, but Gmail deliver failed')
    }

    return json({ success: true });
};
