import { json, error as svelteError, type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString().trim()

    if (!email || !password) { return json({ success: false, error: 'All fields are required.' }, { status: 400 }) }

    const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password})

    if (error) { return json({ success: false, error: error.message }, { status: 400 }) }

    return json({ success: true, message: 'Login successful' })
}
