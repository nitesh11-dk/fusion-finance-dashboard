"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockHeader } from "@/components/StockHeader";
import { PriceChart } from "@/components/PriceChart";
import { VolumeChart } from "@/components/VolumeChart";
import { ThemeToggle } from "@/components/theme-toggle";
import { StockFundamentals } from "@/components/StockFundamental";

interface StockDetail {
    symbol: string;
    companyName: string;
    currentPrice: number;
    marketCap: number;
    volume: number;
    priceData: {
        time: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[];
    lastUpdated: string;
}

interface StockDetailPageProps {
    params: { symbol: string };
}

export default function StockDetailPage({ params }: StockDetailPageProps) {
    const { symbol } = params;
    const [data, setData] = useState<StockDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setError(null);
                const res = await fetch(`/api/fetchStockDetails/${symbol}`);
                if (!res.ok) throw new Error("Failed to fetch stock details");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error("Error fetching details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [symbol]);

    if (loading) {
        return (
            <p className="text-center mt-20 text-muted-foreground">Loading...</p>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-xl font-semibold text-red-500">
                        Error loading stock details
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {error || "Stock not found."}
                    </p>
                    <Link href="/stocks">
                        <Button className="mt-4">Back</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/stocks">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {data.companyName} ({data.symbol})
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Real-Time Stock Dashboard
                            </p>
                        </div>
                    </div>
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Stock Overview */}
                <StockHeader data={data} />

                {/* Fundamentals */}
                <StockFundamentals symbol={symbol} />

                {/* Technical Analysis Button */}
                <div className="flex justify-end my-6">
                    <Link href={`/stock/${symbol}/technical`}>
                        <Button className="px-6" variant="outline">
                            View Technical Analysis →
                        </Button>
                    </Link>
                </div>

                {/* Charts */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    <PriceChart data={data.priceData || []} />

                    <VolumeChart data={data.priceData || []} />

                </section>
            </main>
        </div>
    );
}
