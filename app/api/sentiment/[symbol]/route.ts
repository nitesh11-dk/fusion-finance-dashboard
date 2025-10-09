// app/api/sentiment/[symbol]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import Sentiment from "@/lib/models/Sentimental";

const WEBHOOK_URL = "http://localhost:5680/webhook-test/bba3859c-29be-4c79-a3d8-06da0977f216";

export async function GET(
  req: NextRequest,
  { params }: { params: { symbol: string } }
) {
  const { symbol } = params;
  if (!symbol) {
    return NextResponse.json({ message: "Symbol is required" }, { status: 400 });
  }

  // Connect to MongoDB
  await connectToDatabase();
  console.log("✅ Connected to database");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize date

  try {
    // 🔹 Check if today's sentiment already exists
    let existing = await Sentiment.findOne({ stock_name: symbol, date_analyzed: today });
    if (existing) {
      console.log("📌 Found existing sentiment in DB:", existing);
      return NextResponse.json({ data: existing, message: "Fetched from DB" }, { status: 200 });
    }

    console.log("🌐 No existing data, calling webhook...");

    // 🔹 Trigger the webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_name: symbol, date: today.toISOString().split("T")[0] })
    });


    console.log("✅ Webhook responded", response);

    return NextResponse.json({ message: "Fetched from webhook " }, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching sentiment:", error);
    return NextResponse.json({ message: "Error fetching sentiment", error: error.message }, { status: 500 });
  }
}
