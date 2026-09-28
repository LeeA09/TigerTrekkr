import { error } from '@sveltejs/kit';
import type { RequestHandler } from './\$types';
import { PUBLIC_SUPABASE_URL } from '\$env/static/public';

export const GET: RequestHandler = async ({ url, params, fetch }) => {
    const path = params.catchall;
    
    const searchParams = url.searchParams.toString();
    const targetUrl = `${PUBLIC_SUPABASE_URL}/auth/v1/${path}?${searchParams}`;

    try {
        const response = await fetch(targetUrl, { 
            method: 'GET',
            headers: {
                // Forwards any native cookies or session information if present
                'Accept': 'text/html,application/xhtml+xml,application/xml'
            }
        });
        
        return new Response(response.body, {
            status: response.status,
            headers: response.headers
        });

    } catch (err) {
        console.error('Authentication Proxy Routing Failed:', err);
        throw error(500, 'Internal Authentication Broker Error');
    }
};
