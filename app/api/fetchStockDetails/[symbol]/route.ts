import { NextRequest, NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(
    req: NextRequest,
    { params }: { params: { symbol: string } }
) {
    const { symbol } = params;

    try {
        if (!symbol) throw new Error("Symbol is required");

        // 🟩 Fetch basic stock info
        const stockInfo = await yahooFinance.quote(symbol);
        if (!stockInfo) throw new Error(`No data found for ${symbol}`);

        // 🟦 Fetch intraday price data for last 24 hours
        const now = new Date();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const history = await yahooFinance.chart(symbol, {
            interval: "1h",
            period1: oneDayAgo,
            period2: now,
        });

        // 🟩 Fix here → only return `time` and `price`
        const priceData =
            history?.quotes?.map((q) => ({
                time: q.date
                    ? new Date(q.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "N/A",
                price: q.close, // ✅ renamed from close → price
            })) || [];

        const stockDetails = {
            symbol: stockInfo.symbol,
            companyName: stockInfo.shortName || stockInfo.longName || symbol,
            currentPrice: stockInfo.regularMarketPrice,
            marketCap: stockInfo.marketCap,
            volume: stockInfo.regularMarketVolume,
            priceData, // ✅ now matches `PriceChartProps`
            lastUpdated: new Date(),
        };

        return NextResponse.json(stockDetails, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching stock details:", error);
        return NextResponse.json(
            { message: "Error fetching stock details", error: error.message },
            { status: 500 }
        );
    }
}
