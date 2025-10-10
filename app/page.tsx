"use client"

import { TrendingUp, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
      {/* Disclaimer */}
      <div
        className="fixed top-4 right-4 z-50 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded shadow-md text-center"
        style={{ maxWidth: "220px" }}
      >
        ⚠️ For market analysis only — do not blindly trust
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-16 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            StockSage
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced analytics and visualization dashboard for stocks and
            cryptocurrency markets
          </p>
        </div>

        {/* Selection Cards */}
        <div className="w-fit mx-auto mt-12">
          {/* Stocks Card */}
          <Card className="p-8 backdrop-blur-sm bg-card/50 border-border hover:scale-[1.02] hover:border-primary/50 transition-all cursor-pointer group">
            <Link href="/stocks">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Stocks</h2>
                <p className="text-muted-foreground">
                  Analyze stock market trends with real-time data and AI-powered
                  predictions
                </p>
                <Button className="w-full" size="lg">
                  View Dashboard
                </Button>
              </div>
            </Link>
          </Card>

          {/* Cryptocurrency Card */}
          {/* <Card className="p-8 backdrop-blur-sm bg-card/50 border-border opacity-60 cursor-not-allowed">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-muted to-muted-foreground rounded-2xl flex items-center justify-center">
                <Bitcoin className="w-8 h-8 text-background" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Cryptocurrency
              </h2>
              <p className="text-muted-foreground">
                Track crypto market movements and predict future trends
              </p>
              <Button className="w-full" size="lg" disabled>
                Coming Soon
              </Button>
            </div>
          </Card> */}
        </div>

        {/* Features */}
        <div className="w-fit mx-auto flex gap-6 mt-16">
          <div className="space-y-2">
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold text-foreground">Real-time Data</h3>
            <p className="text-sm text-muted-foreground">
              Live market data and instant updates
            </p>
          </div>
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="text-3xl">📊</div>
              <h3 className="font-semibold text-foreground">Fundamental & Technical Scores</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis combining company fundamentals and technical indicators
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
