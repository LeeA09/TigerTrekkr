import { error } from '@sveltejs/kit';

export async function GET({ url }) {
    const targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
        throw error(400, 'Missing image URL parameter');
    }

    try {
        // Fetch the image from your local Supabase instance server-to-server (HTTP is allowed here)
        const response = await fetch(targetUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch image from storage');
        }

        // Forward the image data and content-type back to the frontend securely via HTTPS
        const blob = await response.blob();
        return new Response(blob, {
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (err) {
        console.error('Image proxy error:', err);
        throw error(500, 'Could not load image');
    }
}
