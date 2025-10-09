"use client"

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VolumeDataPoint {
  time: string;
  volume: number;
}

interface VolumeChartProps {
  data: VolumeDataPoint[];
}

export const VolumeChart = ({ data }: VolumeChartProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border">
      <h2 className="text-xl font-semibold mb-6 text-foreground">
        Trading Volume
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()}`,
              "Volume",
            ]}
          />
          <Bar
            dataKey="volume"
            fill="hsl(var(--accent))"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
