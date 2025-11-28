"use client";

import { useEffect, useState } from "react";
import { RadialBarChart, RadialBar } from "recharts";
import { getRandomSentimentComments } from "@/utils/getSentimentSample";

interface FundamentalResult {
  fundamentalScore: number;
}

interface TechnicalIndicators {
  rsi: number[];
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
  const [sentiment, setSentiment] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [fundRes, techRes] = await Promise.all([
          fetch(`/api/fetchFundamentals/${symbol}`),
          fetch(`/api/technical/${symbol}`)
        ]);

        const fundJson = await fundRes.json();
        const techJson = await techRes.json();

        setFundamental(fundJson);
        setTechnical(techJson);

        const sentimentData = getRandomSentimentComments(symbol);
        setSentiment(sentimentData);

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  if (loading) return <p className="text-center text-muted-foreground">Loading analysis...</p>;
  if (!fundamental || !technical) return <p className="text-center text-red-600">Error loading data.</p>;

  // === Score Calculations ===
  const latestRSI = technical.indicators.rsi.at(-1) || 50;
  const technicalScore = Math.max(0, Math.min(100, 100 - latestRSI));

  const fundamentalScore = Math.round((fundamental.fundamentalScore || 0) * 100);

  const totalSentiments = sentiment.positive.length + sentiment.neutral.length + sentiment.negative.length;
  const socialScore = totalSentiments ? Math.round((sentiment.positive.length / totalSentiments) * 100) : 50;

  const getColor = (score: number) =>
    score > 70 ? "#16a34a" : score > 50 ? "#f59e0b" : "#dc2626";

  // === Dynamic Suggestion messages ===
  const getSuggestion = (label: string, score: number) => {
    if (score > 75) return `${label} sentiment is strong. Recommended to consider BUYING.`;
    if (score > 55) return `${label} trend is stable. HOLD position recommended.`;
    if (score > 40) return `${label} indicates caution. Monitor movement closely.`;
    return `${label} outlook is weak. Consider AVOIDING or SELLING.`;
  };

  return (
    <div className="space-y-12">

      <h2 className="text-center text-2xl font-bold">Analysis Summary</h2>

      {/* SCORE UI */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10">

        <ScoreBlock 
          label="Technical" 
          score={technicalScore} 
          color={getColor(technicalScore)}
          suggestion={getSuggestion("Technical", technicalScore)} 
        />

        <ScoreBlock 
          label="Fundamental" 
          score={fundamentalScore} 
          color={getColor(fundamentalScore)} 
          suggestion={getSuggestion("Fundamental", fundamentalScore)} 
        />

        <ScoreBlock 
          label="Social" 
          score={socialScore} 
          color={getColor(socialScore)}
          suggestion={getSuggestion("Social", socialScore)} 
        />
      </div>

    </div>
  );
}


// =======================
// Sub Component
// =======================
function ScoreBlock({ label, score, color, suggestion }: any) {
  return (
    <div className="flex flex-col items-center w-[250px] text-center space-y-3">
      <h3 className="font-semibold">{label} Score</h3>

      <RadialBarChart width={160} height={160} innerRadius="70%" outerRadius="100%"
        data={[{ value: score }]}>
        <RadialBar clockWise dataKey="value" cornerRadius={20} fill={color} />
        <text x={80} y={80} textAnchor="middle" dominantBaseline="middle" className="font-bold text-lg">
          {score}%
        </text>
      </RadialBarChart>

      <p className="text-sm text-muted-foreground">{suggestion}</p>
    </div>
  );
}
