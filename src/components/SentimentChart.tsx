"use client"

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { SentimentComments } from "./SentimentComments";
import { Comment, stockComments } from "@/data/stockData";

interface SentimentDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface SentimentChartProps {
  data: SentimentDataPoint[];
  stockSymbol: string;
}

export const SentimentChart = ({ data, stockSymbol }: SentimentChartProps) => {
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const comments = stockComments[stockSymbol] || [];

  const handlePieClick = (data: any) => {
    const sentimentType = data.name.toLowerCase();
    setSelectedSentiment(selectedSentiment === sentimentType ? null : sentimentType);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 backdrop-blur-sm bg-card/50 border-border">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          Market Sentiment Distribution
          <span className="text-sm font-normal text-muted-foreground ml-2">
            (Click on segments to view comments)
          </span>
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) =>
                `${entry.name}: ${((entry.percent || 0) * 100).toFixed(0)}%`
              }
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              onClick={handlePieClick}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={selectedSentiment === entry.name.toLowerCase() ? "#000" : "none"}
                  strokeWidth={selectedSentiment === entry.name.toLowerCase() ? 2 : 0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Legend
              wrapperStyle={{
                color: "hsl(var(--foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {selectedSentiment && (
        <SentimentComments
          sentimentType={selectedSentiment as "positive" | "neutral" | "negative"}
          comments={comments}
        />
      )}
    </div>
  );
};
