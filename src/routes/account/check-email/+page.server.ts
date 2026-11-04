import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const session = await locals.getSession?.() || (await locals.safeGetSession?.())?.session;

  if (session) {
    throw redirect(303, '/'); 
  }

  const allowed = cookies.get('sign_up');

  if(!allowed){ throw redirect(303, '/'); }
  cookies.delete('sign_up', { path: '/' });

  return {};
};
