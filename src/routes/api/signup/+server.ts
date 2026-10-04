import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'
import { sendEmail } from '\$lib/server/mailer'

export const POST: RequestHandler = async ({ request, locals, url }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString().trim()
    const confirmPassword = formData.get('confirmPassword')?.toString().trim()
    const username = formData.get('username')?.toString().trim()

    if (!email || !password || !confirmPassword || !username) { return json({ success: false, error: 'All fields are required.' }, { status: 400 }) }

    if (password !== confirmPassword) { return json({ success: false, error: 'Passwords do not match.' }, { status: 400 }) }

    const { supabaseAdmin } = locals
    if (!supabaseAdmin) { return json({ success: false, error: "Server misconfiguration: Database client not found." }, { status: 500 }) }

    // Call your local self-hosted Supabase Auth engine
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.generateLink({ 
        type: 'signup',
        email: email,
        password: password,
        options: {
            redirectTo: `${url.origin}/auth/callback`,
            data: { display_name: username }
        }
    })	

    if (authError || !authData.properties?.action_link) { return json({ success: false, error: authError?.message || 'Failed to generate security token' }, { status: 400 }) }

    const rawVerificationLink = authData.properties.action_link

    const verificationLink = rawVerificationLink.replace('127.0.0.1:54321', url.host)

    try {
        await sendEmail({
            to: email,
            subject: `Welcome to TigerTrekkr, ${username}!`,
            text: `Hi ${username}! Confirm your account here: ${verificationLink}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome aboard, ${username}!</h2>
                    <p>Thank you for signing up. Click below to verify your email and activate your account:</p>
                    <a href="${verificationLink}" style="background-color: #ff3e00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 15px 0;">
                        Verify My Account
                    </a>
                </div>
                `
        })
    } catch (mailError) {
        console.error('Mail Error:', mailError)
        return json({ success: false, error: 'Account initialized, but Gmail deliver failed.' }, { status: 500 })
    }

    return json({ success: true, message: '', email: email })
  }
