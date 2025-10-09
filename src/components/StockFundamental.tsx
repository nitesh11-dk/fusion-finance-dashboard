"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FundamentalAnalysisResult } from "@/utils/fundamental";

interface StockFundamentalsProps {
    symbol: string;
}

export function StockFundamentals({ symbol }: StockFundamentalsProps) {
    const [data, setData] = useState<FundamentalAnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFundamentals = async () => {
            try {
                setError(null);
                setLoading(true);
                const res = await fetch(`/api/fetchFundamentals/${symbol}`);
                if (!res.ok) throw new Error("Failed to fetch fundamental data");
                const json = await res.json();
                setData(json);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFundamentals();
    }, [symbol]);

    if (loading) return <p className="text-center text-muted-foreground">Loading fundamentals...</p>;
    if (error || !data)
        return <p className="text-center text-red-500">Error: {error || "No fundamental data available."}</p>;

    const { metrics, fundamentalScore } = data;

    return (
        <Card className="mb-6">
            <CardContent>
                <h2 className="text-lg font-bold mb-4">Fundamental Analysis</h2>
                <table className="w-full text-sm text-left border-collapse">
                    <tbody>
                        <tr>
                            <td className="py-1 font-medium">Market Cap:</td>
                            <td>{metrics.marketCap?.toLocaleString() ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">P/E Ratio:</td>
                            <td>{metrics.peRatio ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">P/B Ratio:</td>
                            <td>{metrics.pbRatio ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">EPS:</td>
                            <td>{metrics.eps ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">ROE:</td>
                            <td>{metrics.roe ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Debt/Equity:</td>
                            <td>{metrics.debtEquity ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Dividend Yield:</td>
                            <td>{metrics.dividendYield ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Operating Margins:</td>
                            <td>{metrics.operatingMargins ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">Current Ratio:</td>
                            <td>{metrics.currentRatio ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">PEG Ratio:</td>
                            <td>{metrics.pegRatio ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">52-Week High:</td>
                            <td>{metrics.fiftyTwoWeekHigh ?? "N/A"}</td>
                        </tr>
                        <tr>
                            <td className="py-1 font-medium">52-Week Low:</td>
                            <td>{metrics.fiftyTwoWeekLow ?? "N/A"}</td>
                        </tr>
                        <tr className="border-t pt-2">
                            <td className="py-1 font-bold">Fundamental Score:</td>
                            <td>{(fundamentalScore * 100).toFixed(2)}%</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
