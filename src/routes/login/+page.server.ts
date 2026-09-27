import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request, locals }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
	return fail(400, { message: 'All fields are required.' })
    }

    const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password})


    

//    console.log(error)

    if (error) {
      // Failed: Could be wrong password, unregistered email, or unconfirmed email
      console.error("Login failed:", error.message) 
    } else if (data.session) {
      // Success: Valid user and active session
      console.log("Logged in user:", data.user)
    }

    if (error) {
	return fail(400, { message: error.message })
    }

    redirect(303, '/')
  }
}
