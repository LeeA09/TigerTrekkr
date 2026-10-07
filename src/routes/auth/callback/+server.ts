import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { EmailOtpType } from '@supabase/supabase-js'

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
    const code = url.searchParams.get('code')
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type') as EmailOtpType | null
    const next = url.searchParams.get('next') ?? '/'

    console.log('--- Auth Callback Params ---', { code, token_hash, type });

    if (code) {
	const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            throw redirect(303, next)
        }
        console.error('Code Exchange Failed:', error);
    }

    if (token_hash && type) {
	    const { error } = await supabase.auth.verifyOtp({ type: type as any, token_hash })
        if (!error) {
            throw redirect(303, next)
        }
        console.error('OTP Verification Failed:', error);
    }

    throw redirect(303, '/auth/auth-error')
}
