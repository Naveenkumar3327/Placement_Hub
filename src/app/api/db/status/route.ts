import { NextResponse } from "next/server";
import { connectDB, getDbStatus } from "@/lib/db/connect";

export async function GET() {
  try {
    await connectDB();
    const status = await getDbStatus();

    return NextResponse.json({
      success: true,
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

