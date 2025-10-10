"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar, Legend } from "recharts";
import { Button } from "@/components/ui/button";

interface FundamentalMetrics {
  marketCap: number | null;
  peRatio: number | null;
  pbRatio: number | null;
  eps: number | null;
  roe: number | null;
  debtEquity: number | null;
  dividendYield: number | null;
  totalRevenue: number | null;
  freeCashFlow: number | null;
  fiftyTwoWeekHigh: number | null;
  fiftyTwoWeekLow: number | null;
  pegRatio: number | null;
  operatingMargins: number | null;
  currentRatio: number | null;
  beta: number | null;
  profitMargins: number | null;
  revenuePerShare: number | null;
  earningsGrowth: number | null;
}

interface FundamentalResult {
  metrics: FundamentalMetrics;
  fundamentalScore: number; // 0-1
}

interface TechnicalIndicators {
  rsi: number[];
  sma20: number[];
  ema20: number[];
  macd: any[];
  bb: any[];
  stoch: any[];
  atr: number[];
  williamsR: number[];
  cci: number[];
  obv: number[];
}

interface TechnicalResult {
  indicators: TechnicalIndicators;
}

interface AnalysisProps {
  symbol: string;
}

export function Analysis({ symbol }: AnalysisProps) {
  const [fundamental, setFundamental] = useState<FundamentalResult | null>(null);
  const [technical, setTechnical] = useState<TechnicalResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const [fundRes, techRes] = await Promise.all([
          fetch(`/api/fetchFundamentals/${symbol}`),
          fetch(`/api/technical/${symbol}`)
        ]);

        if (!fundRes.ok) throw new Error("Failed to fetch fundamental data");
        if (!techRes.ok) throw new Error("Failed to fetch technical data");

        const fundJson = await fundRes.json();
        const techJson = await techRes.json();

        setFundamental(fundJson);
        setTechnical(techJson);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <p className="text-center mt-4 text-muted-foreground">Loading analysis...</p>;
  if (error || !fundamental || !technical) return <p className="text-center mt-4 text-red-600">Error: {error || "Data not found"}</p>;

  // Short-term decision based on technical indicators (simplified)
  const latestRSI = technical.indicators.rsi[technical.indicators.rsi.length - 1] || 50;
  const shortTermScore = Math.max(0, Math.min(100, 100 - latestRSI)); // higher RSI -> less buy
  const shortTermText = latestRSI < 30 ? "Short-term BUY suggested (oversold)." :
    latestRSI > 70 ? "Short-term SELL suggested (overbought)." :
      "Short-term HOLD recommended.";

  // Long-term decision based on fundamental score
  const longTermScore = Math.round((fundamental.fundamentalScore || 0) * 100);
  const longTermText = longTermScore > 70 ? "Strong long-term BUY suggested based on fundamentals." :
    longTermScore > 50 ? "Moderate long-term BUY suggested." :
      "Long-term HOLD / Avoid recommendation.";

  const shortData = [{ name: "Short-Term", value: shortTermScore }];
  const longData = [{ name: "Long-Term", value: longTermScore }];

  const getColor = (score: number) => score > 70 ? "#16a34a" : score > 50 ? "#f59e0b" : "#dc2626";

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-foreground">Analysis for {symbol}</h1>

      <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
        {/* Short-term RadialBar */}
        <div className="w-48 h-48">
          <RadialBarChart
            width={192}
            height={192}
            innerRadius="70%"
            outerRadius="100%"
            data={shortData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              minAngle={15}
              clockWise
              dataKey="value"
              cornerRadius={20}
              fill={getColor(shortTermScore)}
            />
            <text
              x={96}
              y={96}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-lg"
            >
              {shortTermScore}%
            </text>
          </RadialBarChart>
          <p className="mt-2 text-center text-sm">{shortTermText}</p>
        </div>

        {/* Long-term RadialBar */}
        <div className="w-48 h-48">
          <RadialBarChart
            width={192}
            height={192}
            innerRadius="70%"
            outerRadius="100%"
            data={longData}
            startAngle={180}
            endAngle={-180}
          >
            <RadialBar
              minAngle={15}
              clockWise
              dataKey="value"
              cornerRadius={20}
              fill={getColor(longTermScore)}
            />
            <text
              x={96}
              y={96}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-lg"
            >
              {longTermScore}%
            </text>
          </RadialBarChart>
          <p className="mt-2 text-center text-sm">{longTermText}</p>
        </div>
      </div>


    </div>
  );
}
