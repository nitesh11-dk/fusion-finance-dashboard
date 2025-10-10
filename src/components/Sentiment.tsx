"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar } from "recharts";

interface FundamentalMetrics {
  // same as before
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

  if (loading) return <p className="text-center mt-4 text-gray-500">Loading analysis...</p>;
  if (error || !fundamental || !technical) return <p className="text-center mt-4 text-red-600">Error: {error || "Data not found"}</p>;

  // === Calculate scores ===
  const latestRSI = technical.indicators.rsi[technical.indicators.rsi.length - 1] || 50;
  const shortTermScore = Math.max(0, Math.min(100, 100 - latestRSI)); // higher RSI -> less buy
  const longTermScore = Math.round((fundamental.fundamentalScore || 0) * 100);

  // === Text explanations ===
  const shortTermText =
    latestRSI < 30 ? "Short-term BUY suggested (oversold)." :
      latestRSI > 70 ? "Short-term SELL suggested (overbought)." :
        "Short-term HOLD recommended.";

  const longTermText =
    longTermScore > 70 ? "Strong long-term BUY suggested based on fundamentals." :
      longTermScore > 50 ? "Moderate long-term BUY suggested." :
        "Long-term HOLD / Avoid recommendation.";

  const shortData = [{ name: "Short-Term", value: shortTermScore }];
  const longData = [{ name: "Long-Term", value: longTermScore }];

  const getColor = (score: number) => score > 70 ? "#16a34a" : score > 50 ? "#f59e0b" : "#dc2626";

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Stock Analysis: {symbol.toUpperCase()}
      </h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-12">
        {/* Short-term chart / Technical Analysis */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Technical Analysis</h3>
          <RadialBarChart
            width={180}
            height={180}
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
              x={90}
              y={90}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-lg"
            >
              {shortTermScore.toFixed(2)}%
            </text>
          </RadialBarChart>
          <p className="mt-3 text-center text-sm text-gray-700">{shortTermText}</p>
        </div>

        {/* Long-term chart / Fundamental Analysis */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Fundamental Analysis</h3>
          <RadialBarChart
            width={180}
            height={180}
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
              x={90}
              y={90}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-bold text-lg"
            >
              {longTermScore.toFixed(2)}%
            </text>
          </RadialBarChart>
          <p className="mt-3 text-center text-sm text-gray-700">{longTermText}</p>
        </div>
      </div>

    </div>
  );
}
