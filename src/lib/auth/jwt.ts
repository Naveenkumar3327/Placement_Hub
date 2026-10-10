import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "production-grade-jwt-secret-key-32-chars-long-placement-portal";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  email: string;
  role: "student" | "company" | "admin";
  name: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
}
