// app/api/sentiment/save/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongo";
import Sentiment from "@/lib/models/Sentimental";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { stock_name, date_analyzed, sentiment_analysis, top_news } = body;

        if (!stock_name || !date_analyzed || !sentiment_analysis || !top_news) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();

        const record = new Sentiment({
            stock_name,
            date_analyzed: new Date(date_analyzed),
            sentiment_analysis: {
                ...sentiment_analysis,
                overall_sentiment: sentiment_analysis.overall_sentiment.toLowerCase()
            },
            top_news
        });

        const saved = await record.save();

        console.log("💾 Saved sentiment record via webhook POST:", saved);

        return NextResponse.json({ data: saved, message: "Sentiment saved successfully" }, { status: 200 });
    } catch (err: any) {
        console.error("❌ Error saving sentiment:", err);
        return NextResponse.json({ message: "Error saving sentiment", error: err.message }, { status: 500 });
    }
}
