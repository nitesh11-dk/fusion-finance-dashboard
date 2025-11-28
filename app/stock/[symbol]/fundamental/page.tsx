"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StockFundamentals } from "@/components/StockFundamental";
import { ThemeToggle } from "@/components/theme-toggle";
import { Analysis } from "@/components/Sentiment";

interface FundamentalPageProps {
    params: { symbol: string };
}

export default function FundamentalPage({ params }: FundamentalPageProps) {
    const { symbol } = params;

    return (
        <div className="min-h-screen bg-background p-4">
            {/* Header */}
            <header className="flex items-center gap-4 mb-6 w-full ">
                <Link href={`/stock/${symbol}`}>
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </Link>

                <h1 className="text-2xl font-bold ">{symbol} Fundamental Analysis</h1>

                {/* Disclaimer */}
                <div
                    className="ml-auto bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded shadow-md"
                    style={{ maxWidth: "220px", textAlign: "center" }}
                >
                    ⚠️ For market analysis only — do not blindly trust
                </div>

                <ThemeToggle />
            </header>

            {/* Main Content */}
            <main className="space-y-20">

                {/* Fundamentals Component */}
                <StockFundamentals symbol={symbol} />

              
            </main>
        </div>
    );
}
