"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { getRandomSentimentComments } from "@/utils/getSentimentSample";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SocialPageProps {
    params: { symbol: string };
}

export default function SocialSentimentPage({ params }: SocialPageProps) {
    const { symbol } = params;

    // get 3 to 8 random comments mixed
    const sentimentData = getRandomSentimentComments(symbol);

    const allComments = [
        ...sentimentData.positive,
        ...sentimentData.neutral,
        ...sentimentData.negative
    ]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 6);

    const getSourceColor = (src: string) =>
        src === "Twitter"
            ? "bg-blue-500"
            : src === "Reddit"
                ? "bg-orange-500"
                : "bg-purple-500";

    const getSentimentColor = (sent: string) =>
        sent === "positive"
            ? "text-green-500"
            : sent === "negative"
                ? "text-red-500"
                : "text-yellow-500";

    return (
        <div className="min-h-screen bg-background p-4">

            {/* Header */}
            <header className="flex items-center gap-4 mb-6 w-full">
                <Link href={`/stock/${symbol}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold">{symbol} Social Sentiment</h1>

                <div className="ml-auto bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded shadow-md">
                    ⚠️ Not financial advice — based on public opinions
                </div>

                <ThemeToggle />
            </header>

            <main className="space-y-10">
                
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Mentions</h2>

                    <ScrollArea className="h-[550px] pr-3">
                        
                        {allComments.map((comment: any) => (
                            <div
                                key={comment.id}
                                className="border rounded-lg p-4 mb-4 hover:bg-muted/20 transition"
                            >
                                <p className="mb-3 text-foreground">{comment.text}</p>

                                <div className="flex justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            className={`${getSourceColor(comment.source)} text-white`}
                                        >
                                            {comment.source}
                                        </Badge>

                                        <span>@{comment.author}</span>
                                    </div>

                                    <span className={getSentimentColor(comment.sentiment)}>
                                        {comment.sentiment.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </ScrollArea>
                </Card>

            </main>
        </div>
    );
}
