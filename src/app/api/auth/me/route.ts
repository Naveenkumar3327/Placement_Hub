import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/context";

export async function GET(req: NextRequest) {
  try {
    const { user, payload } = await getCurrentUser(req);

    if (!user || !payload) {
      return NextResponse.json(
        { success: false, message: "Not authenticated." },
        { status: 401 }
      );
    }

    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Session verification failed." },
      { status: 500 }
    );
  }
}
