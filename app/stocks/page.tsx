"use client"

import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockCard } from "@/components/StockCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { trendingStocks } from "@/data/stockData";

export default function StocksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    Trending Stocks
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Top performing stocks today
                  </p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              📈 Top Trending Stocks Today
            </h2>
            <p className="text-muted-foreground">
              Click on any stock to view detailed analytics, sentiment analysis, and forecasts
            </p>
          </div>

          {/* Stock Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingStocks.map((stock) => (
              <StockCard
                key={stock.symbol}
                symbol={stock.symbol}
                companyName={stock.companyName}
                currentPrice={stock.currentPrice}
                changePercent={stock.changePercent}
                sentimentScore={stock.sentimentScore}
                sparkline={stock.sparkline}
              />
            ))}
          </div>
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
