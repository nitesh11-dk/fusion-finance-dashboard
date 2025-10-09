import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Calendar } from "lucide-react";

interface ForecastData {
  prediction: string;
  confidence: number;
  reason: string;
  targetPrice: number;
  timeframe: string;
}

interface ForecastCardProps {
  data: ForecastData;
}

export const ForecastCard = ({ data }: ForecastCardProps) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Short-Term Forecast
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Prediction</span>
          <span className="text-2xl font-bold text-success">
            📈 {data.prediction}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all"
                style={{ width: `${data.confidence}%` }}
              />
            </div>
            <span className="text-lg font-semibold text-foreground">
              {data.confidence}%
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Target Price</p>
            <p className="text-xl font-bold text-foreground">
              ${data.targetPrice}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-muted-foreground">Timeframe</p>
            <p className="text-foreground">{data.timeframe}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-1">Analysis</p>
          <p className="text-foreground">{data.reason}</p>
        </div>
      </div>
    </Card>
  );
};
