"use client"

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StockCardProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  changePercent: number;
  sentimentScore: number;
  sparkline: number[];
}

export const StockCard = ({
  symbol,
  companyName,
  currentPrice,
  changePercent,
  sentimentScore,
  sparkline,
}: StockCardProps) => {
  const isPositive = changePercent > 0;
  const sparklineData = sparkline.map((price, idx) => ({ idx, price }));

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{symbol}</h3>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
          <div
            className={`flex items-center gap-1 px-3 py-1 rounded-full ${
              isPositive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">
              {isPositive ? "+" : ""}
              {changePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Price */}
        <div>
          <p className="text-3xl font-bold text-foreground">
            ${currentPrice.toFixed(2)}
          </p>
        </div>

        {/* Sparkline */}
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparklineData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Market Sentiment</span>
            <span className="font-semibold text-foreground">
              {sentimentScore}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-success to-success/80 transition-all duration-500"
              style={{ width: `${sentimentScore}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/stocks/${symbol}`}>
          <Button className="w-full" variant="default">
            View Details
          </Button>
        </Link>
      </div>
    </Card>
  );
};
