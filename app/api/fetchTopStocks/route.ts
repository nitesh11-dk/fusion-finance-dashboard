import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import { topIndianSymbols } from "@/data/stockData";
import { topUSSymbols } from "@/data/stockData"; // add US symbols array

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const market = url.searchParams.get("market") || "NS"; // default to NS

        const symbols = market === "US" ? topUSSymbols : topIndianSymbols;

        const stocksData = await Promise.all(
            symbols.map(async (symbol: string) => {
                try {
                    const quote = await yahooFinance.quote(symbol);
                    return {
                        symbol,
                        companyName: quote.shortName || symbol,
                        currentPrice: quote.regularMarketPrice,
                        marketCap: quote.marketCap,
                        volume: quote.regularMarketVolume,
                        changePercent: quote.regularMarketChangePercent,
                        change: quote.regularMarketChange,
                        market,
                        lastUpdated: new Date(quote.regularMarketTime * 1000),
                    };
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    return null;
                }
            })
        );

        const validStocks = stocksData.filter(Boolean);
        return NextResponse.json(validStocks);
    } catch (error: any) {
        console.error("Error fetching top stocks:", error);
        return NextResponse.json(
            { message: "Error fetching top stocks", error: error.message },
            { status: 500 }
        );
    }
}
