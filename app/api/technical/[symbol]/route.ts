// app/api/technical/[symbol]/route.ts
import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';
import { RSI, SMA, EMA, MACD, BollingerBands, Stochastic, ATR, WilliamsR, CCI, OBV } from 'technicalindicators';

export async function GET(req: Request, { params }: { params: { symbol: string } }) {
    const { symbol } = params;

    try {
        // Fetch last 6 months daily data
        const data = await yahooFinance.historical(symbol, {
            period1: '2025-08-01',
            interval: '1d'
        });

        const closes = data.map(d => d.close);
        const opens = data.map(d => d.open);
        const highs = data.map(d => d.high);
        const lows = data.map(d => d.low);
        const volumes = data.map(d => d.volume);
        const dates = data.map(d => d.date);

        // Technical indicators
        const rsi = RSI.calculate({ values: closes, period: 14 });
        const sma20 = SMA.calculate({ values: closes, period: 20 });
        const ema20 = EMA.calculate({ values: closes, period: 20 });
        const macd = MACD.calculate({
            values: closes,
            fastPeriod: 12,
            slowPeriod: 26,
            signalPeriod: 9,
            SimpleMAOscillator: false,
            SimpleMASignal: false
        });

        const bb = BollingerBands.calculate({ period: 20, values: closes, stdDev: 2 });
        const stoch = Stochastic.calculate({ high: highs, low: lows, close: closes, period: 14, signalPeriod: 3 });
        const atr = ATR.calculate({ high: highs, low: lows, close: closes, period: 14 });
        const williamsR = WilliamsR.calculate({ high: highs, low: lows, close: closes, period: 14 });
        const cci = CCI.calculate({ high: highs, low: lows, close: closes, period: 20 });
        const obv = OBV.calculate({ close: closes, volume: volumes });

        return NextResponse.json({
            symbol,
            historical: { dates, opens, highs, lows, closes, volumes },
            indicators: { rsi, sma20, ema20, macd, bb, stoch, atr, williamsR, cci, obv }
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
