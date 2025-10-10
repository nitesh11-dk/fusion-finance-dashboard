import { TrendingUp, DollarSign, Activity, Clock, IndianRupee } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StockOverview {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  sentiment: string;
  sentimentScore: number;
  lastUpdated: string;
  marketCap: string;
  volume: string;
}

interface StockHeaderProps {
  data: StockOverview;
}

export const StockHeader = ({ data }: StockHeaderProps) => {
  const isPositive = data.change > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Stock Price</p>
            <h3 className="text-3xl font-bold text-foreground">
              ₹{data.currentPrice}
            </h3>
            <p
              className={`text-sm mt-1 ${isPositive ? "text-success" : "text-destructive"
                }`}
            >
              {isPositive ? "+" : ""}
              {data.change} ({isPositive ? "+" : ""}
              {data.changePercent}%)
            </p>
          </div>
          <IndianRupee className="w-8 h-8 text-primary" />
        </div>
      </Card>

      {/* <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Market Sentiment
            </p>
            <h3 className="text-2xl font-bold text-success">
              {data.sentiment}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {data.sentimentScore}% Positive
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-success" />
        </div>
      </Card> */}


      <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
            <h3 className="text-2xl font-bold text-foreground">
              <p>
                Market Cap: ₹
                {data.marketCap
                  ? data.marketCap >= 1_00_00_000
                    ? (data.marketCap / 1_00_00_000).toFixed(2) + " Cr"
                    : data.marketCap >= 1_00_000
                      ? (data.marketCap / 1_00_000).toFixed(2) + " L"
                      : data.marketCap.toLocaleString()
                  : "-"}
              </p>

            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Volume: {data.volume}
            </p>
          </div>
          <Activity className="w-8 h-8 text-accent" />
        </div>
      </Card>
      <Card className="p-6 backdrop-blur-sm bg-card/50 border-border hover:scale-[1.02] transition-transform">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
            <h3 className="text-xl font-bold text-foreground">
              {data.lastUpdated}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {data.companyName}
            </p>
          </div>
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
      </Card>
    </div>
  );
};
