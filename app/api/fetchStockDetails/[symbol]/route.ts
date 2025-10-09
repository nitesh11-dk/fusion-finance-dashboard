import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

const WEBHOOK_URL = "http://localhost:5680/webhook-test/bba3859c-29be-4c79-a3d8-06da0977f216";

export async function GET(
    req: NextRequest,
    { params }: { params: { symbol: string } }
) {
    const { symbol } = params;

    try {
        if (!symbol) throw new Error("Symbol is required");

        // 🟩 Fetch stock info
        const stockInfo = await yahooFinance.quote(symbol);
        if (!stockInfo) throw new Error(`No data found for ${symbol}`);

        // 🟦 Fetch 24-hour intraday data
        const now = new Date();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const history = await yahooFinance.chart(symbol, {
            interval: "1h",
            period1: oneDayAgo,
            period2: now,
        });

        const priceData =
            history?.quotes?.map((q) => ({
                time: q.date
                    ? new Date(q.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "N/A",
                price: q.close,
            })) || [];

        const stockDetails = {
            symbol: stockInfo.symbol,
            companyName: stockInfo.shortName || stockInfo.longName || symbol,
            currentPrice: stockInfo.regularMarketPrice,
            marketCap: stockInfo.marketCap,
            volume: stockInfo.regularMarketVolume,
            priceData,
            lastUpdated: new Date(),
        };

        // 🟧 Trigger the n8n webhook
        try {
            await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "stock_data",
                    symbol: stockDetails.symbol,
                    company: stockDetails.companyName,
                    price: stockDetails.currentPrice,
                    marketCap: stockDetails.marketCap,
                    volume: stockDetails.volume,
                    time: stockDetails.lastUpdated,
                }),
            });
            console.log(`✅ Webhook triggered for ${symbol}`);
        } catch (webhookError) {
            console.error("⚠️ Failed to send webhook:", webhookError);
        }

        return NextResponse.json(stockDetails, { status: 200 });
    } catch (error: any) {
        console.error("❌ Error fetching stock details:", error);
        return NextResponse.json(
            { message: "Error fetching stock details", error: error.message },
            { status: 500 }
        );
    }
}
