import bcrypt from "bcryptjs";
import { serialize, parse } from "cookie";

const COOKIE_NAME = "vowly_session";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}

export function setSession(userId: number) {
    return serialize(COOKIE_NAME, userId.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });
}

export function getUserIdFromRequest(request: Request) {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;
    const cookies = parse(cookieHeader);
    const userId = cookies[COOKIE_NAME];
    return userId ? parseInt(userId) : null;
}

export function clearSession() {
    return serialize(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}
