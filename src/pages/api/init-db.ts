import type { APIRoute } from 'astro';
import { initializeTables } from '../../lib/db';

export const GET: APIRoute = async () => {
    try {
        await initializeTables();
        return new Response(JSON.stringify({ success: true, message: 'Database initialized successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
