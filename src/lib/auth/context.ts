import { NextRequest } from "next/server";
import { verifyToken, JwtPayload } from "./jwt";
import { connectDB } from "../db/connect";
import { User, IUser } from "../db/models/User";
import { memoryDb } from "../db/memoryDb";

export async function getCurrentUser(request: NextRequest): Promise<{
  user: any | null;
  payload: JwtPayload | null;
}> {
  // Check Authorization header first
  let token = "";
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }

  // Fallback to cookie
  if (!token) {
    const cookie = request.cookies.get("auth_token");
    if (cookie) {
      token = cookie.value;
    }
  }

  if (!token) {
    return { user: null, payload: null };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { user: null, payload: null };
  }

  // Attempt database retrieval
  try {
    const db = await connectDB();
    if (db && db.connection.readyState === 1) {
      const dbUser = await User.findById(payload.userId).lean();
      if (dbUser) {
        return { user: dbUser, payload };
      }
    }
  } catch (err) {
    // proceed to memoryDb fallback
  }

  // Fallback to memoryDb
  const memUser = memoryDb.users.find(
    (u) => String(u._id) === String(payload.userId) || u.email === payload.email
  );

  return { user: memUser || null, payload };
}
