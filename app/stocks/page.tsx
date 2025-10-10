"use client";

import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  marketCap: number | string;
  volume: number | string;
  changePercent: number;
}

interface User {
  username: string;
  interestShares: string[];
  level: string;
}

export default function StocksPage() {
  const [topStocks, setTopStocks] = useState<Stock[]>([]);
  const [userStocks, setUserStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        // Fetch all top stocks
        const res = await fetch("/api/fetchTopStocks");
        const data = await res.json();
        const sorted = (data?.data || data)
          .filter((s: Stock) => typeof s.changePercent === "number")
          .sort((a: Stock, b: Stock) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

        setTopStocks(sorted.slice(0, 100));

        // Fetch logged-in user
        const userRes = await fetch("/api/user");
        const userData: { user: User } = await userRes.json();
        if (userData?.user?.interestShares) {
          const selected = sorted.filter((s: Stock) =>
            userData.user.interestShares.includes(s.symbol)
          );
          setUserStocks(selected.slice(0, 3)); // show first 3 user-selected stocks
        }
      } catch (error) {
        console.error("Error fetching stocks or user data:", error);
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
                <h1 className="text-2xl font-bold text-foreground">Trending Stocks</h1>
                <p className="text-sm text-muted-foreground">
                  Your selected stocks today
                </p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* User Selected Stocks */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-2"> Your Selected Stocks</h2>
          <p className="text-muted-foreground mb-6">
            Stocks you chose in your onboarding
          </p>

          {loading ? (
            <p className="text-muted-foreground">Loading your stocks...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                return (
                  <div
                    key={stock.symbol}
                    className="rounded-xl border border-border bg-card hover:shadow-md transition-all p-6 cursor-pointer"
                    onClick={() => (window.location.href = `/stock/${stock.symbol}`)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                        <p className="text-sm text-muted-foreground">{stock.companyName}</p>
                      </div>
                      <div
                        className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${isPositive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                          }`}
                      >
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {isPositive ? "+" : ""}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <div className="mt-4 text-3xl font-bold">
                      ₹{stock.currentPrice.toLocaleString()}
                    </div>

                    <div className="text-sm text-muted-foreground mt-1">
                      Market Cap:{" "}
                      {typeof stock.marketCap === "number"
                        ? stock.marketCap >= 10_000_000
                          ? `₹${(stock.marketCap / 10_000_000).toFixed(2)} Cr`
                          : stock.marketCap >= 100_000
                            ? `₹${(stock.marketCap / 100_000).toFixed(2)} L`
                            : `₹${stock.marketCap.toLocaleString()}`
                        : stock.marketCap}
                    </div>

                    <Button className="w-full mt-4" variant="secondary">
                      View Details
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Full Stocks Table */}
        {/* ...Keep your existing table code here as is... */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4"> Top 100 Stocks</h2>

          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="rounded-lg border border-border shadow-sm overflow-hidden">
              <table className="w-full table-auto text-sm border-collapse">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-3 py-2 text-left text-muted-foreground">#</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Symbol</th>
                    <th className="px-3 py-2 text-left text-muted-foreground">Company</th>
                    <th className="px-3 py-2 text-right text-muted-foreground">Price</th>
                    <th className="px-3 py-2 text-right text-muted-foreground">Change</th>
                    <th className="px-3 py-2 text-right text-muted-foreground">Market Cap</th>
                    <th className="px-3 py-2 text-right text-muted-foreground">Volume</th>
                  </tr>
                </thead>
                <tbody>
                  {topStocks.map((stock, idx) => {
                    const isPositive = stock.changePercent >= 0;
                    return (
                      <tr
                        key={stock.symbol}
                        onClick={() => (window.location.href = `/stock/${stock.symbol}`)}
                        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                      >
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 font-semibold text-primary">
                          {stock.symbol}
                        </td>
                        <td className="px-3 py-2">{stock.companyName}</td>
                        <td className="px-3 py-2 text-right">
                          ₹{stock.currentPrice.toLocaleString()}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-medium ${isPositive ? "text-green-600" : "text-red-500"
                            }`}
                        >
                          <div className="flex justify-end items-center gap-1">
                            {isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {isPositive ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {typeof stock.marketCap === "number"
                            ? stock.marketCap >= 10_000_000
                              ? `₹${(stock.marketCap / 10_000_000).toFixed(2)} Cr`
                              : stock.marketCap >= 100_000
                                ? `₹${(stock.marketCap / 100_000).toFixed(2)} L`
                                : `₹${stock.marketCap.toLocaleString()}`
                            : stock.marketCap}
                        </td>

                        <td className="px-3 py-2 text-right">
                          {typeof stock.volume === "number"
                            ? stock.volume.toLocaleString()
                            : stock.volume}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
