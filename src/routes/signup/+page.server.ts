import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('username') as string

    if (!email || !password || !displayName) {
      return fail(400, { message: 'All fields are required.' })
    }

    // Call your local self-hosted Supabase Auth engine
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } })

    if (error) {
      return fail(400, { message: error.message })
    }

    // Since mailer_autoconfirm = true is set in your config.toml, 
    // the user is immediately logged in. Redirect them home.
    throw redirect(303, '/')
  }
}
