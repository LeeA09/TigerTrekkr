import { json, error } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/mailer'

export async function POST({ locals }) {
    const authUser = await locals.safeGetSession?.()

    if (!authUser?.session || !authUser?.user) { throw error(401, 'Unauthorized') }

    const userId = authUser.user.id;
    const username = authUser.userdata.username;

    const { error: deleteError } = await locals.supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) { throw error(500, deleteError.message); }

    await locals.supabase.auth.signOut();

    try {
        await sendEmail({
            to: authUser.user.email,
            subject: '⚠ Account deleted ⚠',
            text: `Account has been deleted for ${username}.`,
            html: `
                <div style="font-size: 125%; font-family: sans-serif; max-width 600px; margin: 0 auto;">
                    <h2>Your account has been deleted!</h2>
                    <p>The account associated with this email for user <strong style="color: #DC562E">${username}</strong> has been successfully deleted.</p>
                    <p>Have a good day!</p>
                    <p>- TigerTrekkr Team</p>
                </div>
                `
        })
    } catch (mailError) {
        console.error('Mail error:', mailError)
        return error(500, 'Account username changed, but Gmail deliver failed')
    }

    return json({ success: true });
}
