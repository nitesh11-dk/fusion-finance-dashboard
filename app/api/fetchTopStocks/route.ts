// app/api/fetchTopStocks/route.ts

import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET() {
    try {
        // Top Indian stocks ke NSE ticker symbols
        const topIndianSymbols = [
            'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
            'ICICIBANK.NS', 'KOTAKBANK.NS', 'SBIN.NS', 'LT.NS', 'AXISBANK.NS',
            'ITC.NS', 'BAJAJ-AUTO.NS', 'BHARTIARTL.NS', 'HCLTECH.NS', 'MARUTI.NS',
            'WIPRO.NS', 'TECHM.NS', 'ASIANPAINT.NS', 'SUNPHARMA.NS', 'NESTLEIND.NS',
            'ULTRACEMCO.NS', 'TITAN.NS', 'HDFCLIFE.NS', 'POWERGRID.NS', 'JSWSTEEL.NS',
            'ONGC.NS', 'DRREDDY.NS', 'COALINDIA.NS', 'ADANIPORTS.NS', 'GRASIM.NS',
            'SBILIFE.NS', 'BPCL.NS', 'NTPC.NS', 'DIVISLAB.NS', 'TATASTEEL.NS',
            'BAJFINANCE.NS', 'EICHERMOT.NS', 'HAVELLS.NS', 'CIPLA.NS', 'INDUSINDBK.NS',
            'HDFC.NS', 'VEDL.NS', 'M&M.NS', 'BRITANNIA.NS', 'ICICIGI.NS', 'SHREECEM.NS',
            'ADANIGREEN.NS', 'APOLLOHOSP.NS', 'TATACONSUM.NS', 'RECLTD.NS', 'DMART.NS'
        ];

        // Stocks ka data fetch karna
        const stocksData = await Promise.all(
            topIndianSymbols.map(async (symbol) => {
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
        console.error('Error fetching top Indian stocks:', error);
        return NextResponse.json({ message: 'Error fetching top stocks', error: error.message }, { status: 500 });
    }
}
