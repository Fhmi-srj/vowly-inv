import type { APIRoute } from "astro";
import { clearSession } from "../../../lib/auth";

export const ALL: APIRoute = async ({ cookies, redirect }) => {
    const sessionCookie = clearSession();

    // We can use Astro.cookies or return a response with Set-Cookie
    // Since this is an APIRoute, we return a Response
    return new Response(null, {
        status: 302,
        headers: {
            "Set-Cookie": sessionCookie,
            "Location": "/",
        },
    });
};
