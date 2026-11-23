import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "ok",
      service: "ustazlab",
      timestamp: new Date().toISOString(),
      aiConfigured: !!(
        process.env.AI_API_URL &&
        process.env.AI_API_KEY &&
        process.env.AI_MODEL
      ),
    });
  } catch {
    return NextResponse.json(
      { status: "degraded", service: "ustazlab" },
      { status: 503 }
    );
  }
}

