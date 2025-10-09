// app/api/fetchTopStocks/route.ts

import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        // Top 50 US stocks ke ticker symbols
        const top50Symbols = [
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'BABA', 'SPY', 'V',
            'JNJ', 'WMT', 'MA', 'PYPL', 'DIS', 'NFLX', 'AMD', 'INTC', 'CSCO', 'BA',
            'GS', 'IBM', 'GE', 'CAT', 'MMM', 'KO', 'PEP', 'PG', 'XOM', 'CVX', 'COP',
            'SLB', 'HAL', 'OXY', 'LMT', 'RTX', 'NOC', 'GD', 'HUM', 'UNH', 'CVS', 'CNC',
            'CI', 'ANTM', 'ELV', 'WBA', 'COST', 'TGT', 'LOW', 'HD', 'BBY', 'M', 'KSS'
        ];

        // Stocks ka data fetch karna
        const stocksData = await Promise.all(
            top50Symbols.map(async (symbol) => {
                try {
                    const quote = await yahooFinance.quote(symbol);
                    return {
                        symbol,
                        companyName: quote.shortName || symbol,
                        currentPrice: quote.regularMarketPrice,
                        marketCap: quote.marketCap,
                        volume: quote.regularMarketVolume,
                        lastUpdated: new Date(quote.regularMarketTime * 1000),
                    };
                } catch (error) {
                    console.error(`Error fetching data for ${symbol}:`, error);
                    return null;
                }
            })
        );

        // Null entries ko filter karna
        const validStocks = stocksData.filter(stock => stock !== null);

        return NextResponse.json(validStocks);
    } catch (error) {
        console.error('Error fetching top stocks:', error);
        return NextResponse.json({ message: 'Error fetching top stocks', error: error.message }, { status: 500 });
    }
}
