import bcrypt from 'bcryptjs';
import { serialize, parse } from 'cookie';

const COOKIE_NAME = "vowly_session";
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}
function setSession(userId) {
  return serialize(COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
    // 1 week
  });
}
function getUserIdFromRequest(request) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  const cookies = parse(cookieHeader);
  const userId = cookies[COOKIE_NAME];
  return userId ? parseInt(userId) : null;
}
function clearSession() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });
}

export { clearSession as c, getUserIdFromRequest as g, hashPassword as h, setSession as s, verifyPassword as v };
