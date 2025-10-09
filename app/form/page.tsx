"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

const stockOptions = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NFLX"];
const experienceOptions = ["Beginner", "Intermediate", "Advanced"];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedStocks, setSelectedStocks] = useState<string[]>([]);
    const [experience, setExperience] = useState("");

    const toggleStock = (stock: string) => {
        if (selectedStocks.includes(stock)) {
            setSelectedStocks(selectedStocks.filter((s) => s !== stock));
        } else if (selectedStocks.length < 3) {
            setSelectedStocks([...selectedStocks, stock]);
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
                            {stockOptions.map((stock) => (
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
                        <Link href="/">
                            <Button className="w-full mt-4" disabled={!experience}>
                                Finish
                            </Button>
                        </Link>
                    </div>
                )}
            </Card>
        </div>
    );
}
