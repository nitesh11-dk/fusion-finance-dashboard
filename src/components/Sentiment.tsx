"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockSentiment {
    stock_name: string;
    date_analyzed: string;
    sentiment_analysis: {
        overall_sentiment: "positive" | "neutral" | "negative";
        reasoning: string;
    };
    top_news: string[];
}

interface SentimentProps {
    symbol: string;
}

export function Sentiment({ symbol }: SentimentProps) {
    const [data, setData] = useState<StockSentiment[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSentiment = async () => {
            try {
                setError(null);
                setLoading(true);

                const res = await fetch(`/api/sentiment/fetch`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ symbol }),
                });

                if (!res.ok) throw new Error("Failed to fetch sentiment data");

                const json = await res.json();
                setData(json.data || null);
            } catch (err: any) {
                console.error("Error fetching sentiment:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSentiment();
    }, [symbol]);

    if (loading)
        return (
            <p className="text-center mt-4 text-muted-foreground">
                Loading sentiment...
            </p>
        );

    if (error || !data)
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded">
                <p>Error loading sentiment: {error || "Data not found."}</p>
                <Link href="/stocks">
                    <Button className="mt-2">Back</Button>
                </Link>
            </div>
        );

    return (
        <div className="space-y-6">
            {data.map((record, idx) => (
                <section
                    key={idx}
                    className="p-6 bg-card rounded-xl border border-border shadow hover:shadow-md transition"
                >


                    {record.top_news.length > 0 && (
                        <div className="mt-4">
                            <strong className="block mb-4 text-lg">📰 Top News:</strong>
                            <div className="flex flex-col">
                                {record.top_news.map((news, i) => (
                                    <div
                                        key={i}
                                        className="w-full p-4 mb-4 bg-background border border-border rounded-xl text-sm shadow-sm hover:shadow-md transition"
                                    >
                                        {news.split("\n").map((line, j) => (
                                            <p key={j} className="mb-1 last:mb-0">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}




                </section>
            ))}
        </div>
    );
}
