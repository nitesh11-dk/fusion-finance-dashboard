"use client"

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Comment {
  id: string;
  text: string;
  author: string;
  source: "Twitter" | "Reddit" | "News";
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

interface SentimentCommentsProps {
  sentimentType: "positive" | "neutral" | "negative";
  comments: Comment[];
}

export const SentimentComments = ({ sentimentType, comments }: SentimentCommentsProps) => {
  // Filter comments by sentiment type
  const filteredComments = comments.filter(comment => comment.sentiment === sentimentType);

  // Get sentiment color classes
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
      case "negative":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800";
    }
  };

  // Get source badge color
  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case "Twitter":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Reddit":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "News":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/50 border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          {sentimentType.charAt(0).toUpperCase() + sentimentType.slice(1)} Sentiment Comments
        </h2>
        <Badge variant="secondary" className="text-sm">
          {filteredComments.length} comments
        </Badge>
      </div>

      {filteredComments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No {sentimentType} sentiment comments found for this stock.
          </p>
        </div>
      ) : (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`p-4 rounded-lg border ${getSentimentColor(comment.sentiment)} hover:shadow-md transition-shadow`}
              >
                <div className="space-y-3">
                  {/* Comment text */}
                  <p className="text-foreground leading-relaxed">
                    {comment.text}
                  </p>

                  {/* Meta information */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {/* Author */}
                      <span className="font-medium text-muted-foreground">
                        @{comment.author}
                      </span>
                      
                      {/* Source badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getSourceBadgeColor(comment.source)}`}
                      >
                        {comment.source}
                      </Badge>
                    </div>

                    {/* Timestamp */}
                    <span className="text-muted-foreground">
                      {formatTimestamp(comment.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
