"use client"

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockHeader } from "@/components/StockHeader";
import { PriceChart } from "@/components/PriceChart";
import { SentimentChart } from "@/components/SentimentChart";
import { NewsFeed } from "@/components/NewsFeed";
import { ForecastCard } from "@/components/ForecastCard";
import { VolumeChart } from "@/components/VolumeChart";
import { ThemeToggle } from "@/components/theme-toggle";
import { trendingStocks, stockDetails } from "@/data/stockData";

interface StockDetailPageProps {
  params: {
    symbol: string;
  };
}

export default function StockDetailPage({ params }: StockDetailPageProps) {
  const { symbol } = params;
  
  // Find the stock overview data
  const stockOverview = trendingStocks.find((s) => s.symbol === symbol);
  
  // Get detailed data for this stock
  const details = symbol ? stockDetails[symbol] : null;

  if (!stockOverview || !details) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Stock Not Found</h1>
          <Link href="/stocks">
            <Button>Back to Stocks</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/stocks">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Stocks
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Stock Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {stockOverview.companyName} ({stockOverview.symbol})
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stock Overview Cards */}
          <StockHeader data={stockOverview} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PriceChart data={details.priceData} />
            <SentimentChart data={details.sentimentData} stockSymbol={symbol} />
          </div>

          {/* News and Forecast */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <NewsFeed data={details.newsData} />
            </div>
            <ForecastCard data={details.forecast} />
          </div>

          {/* Volume Chart */}
          <VolumeChart data={details.volumeData} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Data shown is mock data (for demo only)
        </div>
      </footer>
    </div>
  );
}
