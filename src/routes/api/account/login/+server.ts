import { type RequestHandler } from '@sveltejs/kit'

export const POST: RequestHandler = async ({ request, locals }) => {
    const formData = await request.formData()
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString().trim()

    if (!email || !password) { return Response.json({ success: false, error: 'All fields are required.' }, { status: 200 }) }

    const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password})

    if (error) { return Response.json({ success: false, error: error.message }, { status: 200 }) }

    return Response.json({ success: true, message: 'Login successful' })
}
