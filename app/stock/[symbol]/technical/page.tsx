"use client";

import { useEffect, useState } from "react";
import StockChart from "@/components/Technical";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TechnicalPageProps {
    params: { symbol: string };
}

interface TechnicalData {
    historical: {
        dates: string[];
        opens: number[];
        highs: number[];
        lows: number[];
        closes: number[];
        volumes: number[];
    };
    indicators: {
        rsi: number[];
        sma20: number[];
        ema20: number[];
        macd: { MACD: number; signal: number; histogram: number }[];
        bb: { lower: number; middle: number; upper: number }[];
        stoch: { k: number; d: number }[];
        atr: number[];
        williamsR: number[];
        cci: number[];
        obv: number[];
    };
}

export default function TechnicalPage({ params }: TechnicalPageProps) {
    const { symbol } = params;
    const [data, setData] = useState<TechnicalData | null>(null);
    const [score, setScore] = useState<number | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/technical/${symbol}`);
                const json: TechnicalData = await res.json();
                setData(json);

                // Compute a simple "technical score" out of 100
                let scoreSum = 0;
                let count = 0;

                // Example: RSI (neutral around 50)
                const latestRSI = json.indicators.rsi.slice(-1)[0];
                if (latestRSI) {
                    scoreSum += Math.max(0, Math.min(100, 100 - Math.abs(50 - latestRSI) * 2));
                    count++;
                }

                // Example: MACD histogram
                const latestMACD = json.indicators.macd.slice(-1)[0];
                if (latestMACD) {
                    scoreSum += latestMACD.histogram > 0 ? 100 : 0;
                    count++;
                }

                // SMA vs EMA trend
                const latestSMA = json.indicators.sma20.slice(-1)[0];
                const latestEMA = json.indicators.ema20.slice(-1)[0];
                if (latestSMA && latestEMA) {
                    scoreSum += latestSMA > latestEMA ? 100 : 0;
                    count++;
                }

                // Bollinger Bands: price above middle band
                const latestClose = json.historical.closes.slice(-1)[0];
                const latestBB = json.indicators.bb.slice(-1)[0];
                if (latestClose && latestBB) {
                    scoreSum += latestClose > latestBB.middle ? 100 : 0;
                    count++;
                }

                // Average normalized score
                if (count > 0) setScore(Math.round(scoreSum / count));
            } catch (err) {
                console.error(err);
            }
        }

        fetchData();
    }, [symbol]);

    return (
        <div className="min-h-screen bg-background p-4">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6 w-full">
                <Link href={`/stock/${symbol}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold">{symbol} Technical Analysis</h1>

                {/* Disclaimer */}
                <div
                    className="ml-auto bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded shadow-md"
                    style={{ maxWidth: "220px", textAlign: "center" }}
                >
                    ⚠️ For market analysis only — do not blindly trust
                </div>
            </header>


            {/* Technical Score */}
            {score !== null && (
                <div className="mb-6 p-4 border rounded-lg bg-secondary/10 text-center text-lg font-semibold">
                    Technical Score: {score} / 100
                </div>
            )}

            {/* Charts */}
            <div className="w-full h-[1200px]">
                {data ? <StockChart symbol={symbol} /> : <p>Loading technical charts...</p>}
            </div>
        </div>
    );
}
