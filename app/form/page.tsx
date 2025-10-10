"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { topIndianSymbols } from "@/data/stockData"; // import your stock list

const experienceOptions = ["Beginner", "Intermediate", "Advanced"];
const INITIAL_SHOW = 8; // initially show 8
const INCREMENT = 5; // show 5 more per click

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
    const [experience, setExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(INITIAL_SHOW);

    const toggleStock = (stock: string) => {
        if (selectedStocks.includes(stock)) {
            setSelectedStocks(selectedStocks.filter((s) => s !== stock));
        } else if (selectedStocks.length < 3) {
            setSelectedStocks([...selectedStocks, stock]);
        }
    };

    const handleShowMore = () => {
        setVisibleCount((prev) => Math.min(prev + INCREMENT, topIndianSymbols.length));
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/saveOnboarding", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    interestShares: selectedStocks,
                    level: experience,
                }),
            });

            const data = await res.json();

            if (data.success) {
                toast.success(data.message || "🎉 Onboarding saved successfully!");
                setTimeout(() => router.push("/"), 1500);
            } else {
                toast.error(data.message || "❌ Failed to save onboarding");
            }
        } catch (err: any) {
            console.error("Onboarding error:", err);
            toast.error(err?.message || "🚨 Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 p-4">
            <Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-sm bg-card/50 border-border">
                {step === 1 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-bold text-foreground">Select 3 Stocks</h2>
                        <p className="text-sm text-muted-foreground">
                            Choose up to 3 stocks you are interested in
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {topIndianSymbols.slice(0, visibleCount).map((stock) => (
                                <button
                                    key={stock}
                                    onClick={() => toggleStock(stock)}
                                    className={`p-3 border rounded-lg font-semibold transition ${selectedStocks.includes(stock)
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card hover:border-primary"
                                        }`}
                                >
                                    {stock}
                                </button>
                            ))}
                        </div>

                        {visibleCount < topIndianSymbols.length && (
                            <Button
                                className="w-full mt-2"
                                onClick={handleShowMore}
                            >
                                + More
                            </Button>
                        )}

                        <Button
                            className="w-full mt-4"
                            onClick={() => setStep(2)}
                            disabled={selectedStocks.length !== 3}
                        >
                            Next
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-2xl font-bold text-foreground">Experience Level</h2>
                        <p className="text-sm text-muted-foreground">
                            Select your experience in stocks and fintech
                        </p>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                            {experienceOptions.map((level) => (
                                <button
                                    key={level}
                                    onClick={() => setExperience(level)}
                                    className={`p-3 border rounded-lg font-semibold transition ${experience === level
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card hover:border-primary"
                                        }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                        <Button
                            className="w-full mt-4"
                            disabled={!experience || loading}
                            onClick={handleFinish}
                        >
                            {loading ? "Saving..." : "Finish"}
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
