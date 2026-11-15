import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import type { EmailOtpType } from '@supabase/supabase-js'

export const GET: RequestHandler = async ({ url, locals: { supabase, supabaseAdmin } }) => {
    const code = url.searchParams.get('code')
    const token_hash = url.searchParams.get('token_hash')
    const type = url.searchParams.get('type') as EmailOtpType | null
    const next = url.searchParams.get('next') ?? '/'

    async function provisionUserData(userId: string, username: string) {
        if (!supabaseAdmin) {
            console.error('CRITICAL: supabaseAdmin is missing! RLS policies are likely blocking this insert.');
        }

        const db = supabaseAdmin || supabase;

        const { error } = await db
            .from('user_data')
            .insert({ userid: userId, username: username });

        if (error && error.code === '23505') {
            const randomSuffix = Math.random().toString(36).substring(2, 9);
            const newUsername = `${username}_${randomSuffix}`;

            const retry = await db
                .from('user_data')
                .insert({ userid: userId, username: newUsername });

            if (retry.error) {
                console.error('Failed to provision user data after retry:', retry.error);
            }
        }
        else if (error) {
            console.error('Failed to provision user data:', error);
        }
    }
            
    if (code) {
	    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            await provisionUserData(data.user.id, data.user.user_metadata?.username || 'default_username')
            throw redirect(303, next)
        }
        console.error('Code Exchange Failed:', error);
    }

    if (token_hash && type) {
	    const { data, error } = await supabase.auth.verifyOtp({ type: type as any, token_hash })
        if (!error) {
            await provisionUserData(data.user.id, data.user.user_metadata?.username || 'default_username')
            throw redirect(303, next)
        }
        console.error('OTP Verification Failed:', error);
    }

    throw redirect(303, '/auth/auth-error')
}
