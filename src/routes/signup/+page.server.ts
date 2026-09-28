import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'
import { sendEmail } from '\$lib/server/mailer'

export const actions: Actions = {
  default: async ({ request, locals, url }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    if (!email || !password || !username) {
      return fail(400, { message: 'All fields are required.' })
    }

    const { supabaseAdmin } = locals
    if (!supabaseAdmin) {
	return fail(500, { error: "Server misconfiguration: Database client not found." })
    }

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

    if (authError || !authData.properties?.action_link) {
      return fail(400, { error: authError?.message || 'Failed to generate security token' })
    }

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

	return { success: true }
    } catch (mailError) {
	console.error('Mail Error:', mailError)
	return fail(500, { error: 'Account initialized, but Gmail deliver failed.' })
    }
  }
}
