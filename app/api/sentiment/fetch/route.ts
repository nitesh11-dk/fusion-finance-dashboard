// app/api/sentiment/fetch/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo"; // Your MongoDB connection helper
import Sentiment from "@/lib/models/Sentimental";

export async function POST(req: NextRequest) {
    try {
        // Connect to MongoDB
        await connectToDatabase();

        // Parse the request body
        const body = await req.json();
        const { symbol } = body;

        if (!symbol) {
            return NextResponse.json({ error: "Stock symbol is required." }, { status: 400 });
        }

        // Fetch sentiment data for the given stock symbol
        const sentimentData = await Sentiment.find({ stock_name: symbol }).sort({ date_analyzed: -1 });

        if (!sentimentData || sentimentData.length === 0) {
            return NextResponse.json({ message: "No sentiment data found for this stock." }, { status: 404 });
        }

        return NextResponse.json({ data: sentimentData });
    } catch (error: any) {
        console.error("Error fetching sentiment:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
