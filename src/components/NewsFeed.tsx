import { Card } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  source: string;
  time: string;
}

interface NewsFeedProps {
  data: NewsItem[];
}

export const NewsFeed = ({ data }: NewsFeedProps) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "border-success";
      case "negative":
        return "border-destructive";
      default:
        return "border-muted";
    }
  };

  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-success/20 text-success";
      case "negative":
        return "bg-destructive/20 text-destructive";
      default:
        return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Top Financial News
        </h2>
      </div>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {data.map((news) => (
          <div
            key={news.id}
            className={`p-4 rounded-lg border-l-4 bg-secondary/30 ${getSentimentColor(
              news.sentiment
            )} hover:bg-secondary/50 transition-colors`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">
                  {news.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSentimentBadgeColor(
                  news.sentiment
                )}`}
              >
                {news.sentiment}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
