"use client";

import { ArrowLeft, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StockCard } from "@/components/StockCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { trendingStocks } from "@/data/stockData"; // Top 3
import { useEffect, useState } from "react";

interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  marketCap: number | string;
  volume: number | string;
}

export default function StocksPage() {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const res = await fetch("/api/fetchTopStocks");
        const data = await res.json();
        // Ensure data is an array
        setTopStocks(data?.data || data);
      } catch (error) {
        console.error("Error fetching top stocks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStocks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Top 3 Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            📈 Top Trending Stocks Today
          </h2>
          <p className="text-muted-foreground">
            Click on any stock to view detailed analytics, sentiment analysis, and forecasts
          </p>
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
        {/* Top 100 Stocks Table */}
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            📊 Top 100 Stocks
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading top 100 stocks...</p>
          ) : (
            <div className="rounded-lg border border-border shadow-sm overflow-hidden">
              <table className="w-full table-auto border-collapse text-sm">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border-b border-border px-3 py-2 text-left text-muted-foreground">#</th>
                    <th className="border-b border-border px-3 py-2 text-left text-muted-foreground">Symbol</th>
                    <th className="border-b border-border px-3 py-2 text-left text-muted-foreground">Company</th>
                    <th className="border-b border-border px-3 py-2 text-right text-muted-foreground">Price</th>
                    <th className="border-b border-border px-3 py-2 text-right text-muted-foreground">Market Cap</th>
                    <th className="border-b border-border px-3 py-2 text-right text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody className="bg-background dark:bg-background-dark">
                  {topStocks.map((stock, idx) => (
                    <tr
                      key={stock.symbol}
                      onClick={() => window.location.href = `/stock/${stock.symbol}`}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="border-b border-border px-3 py-2">{idx + 1}</td>
                      <td className="border-b border-border px-3 py-2 font-semibold text-primary">
                        {stock.symbol}
                      </td>
                      <td className="border-b border-border px-3 py-2 text-foreground dark:text-white">
                        {stock.companyName}
                      </td>
                      <td className="border-b border-border px-3 py-2 text-right text-foreground dark:text-white">
                        ₹{stock.currentPrice.toLocaleString()}
                      </td>
                      <td className="border-b border-border px-3 py-2 text-right text-foreground dark:text-white">
                        {typeof stock.marketCap === "number"
                          ? `$${(stock.marketCap / 1_000_000_000).toFixed(2)}B`
                          : stock.marketCap}
                      </td>
                      <td className="border-b border-border px-3 py-2 text-right text-foreground dark:text-white">
                        {typeof stock.volume === "number"
                          ? stock.volume.toLocaleString()
                          : stock.volume}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Data shown is fetched from Yahoo Finance (Top 50/100 stocks)
        </div>
      </footer>
    </div>
  );
}
