import yf from 'yahoo-finance2';

// Interface for metrics
export interface FundamentalMetrics {
    marketCap: number | null;
    peRatio: number | null;
    pbRatio: number | null;
    eps: number | null;
    roe: number | null;
    debtEquity: number | null;
    dividendYield: number | null;
    totalRevenue: number | null;
    freeCashFlow: number | null;
    fiftyTwoWeekHigh: number | null;
    fiftyTwoWeekLow: number | null;
    pegRatio: number | null;
    operatingMargins: number | null;
    currentRatio: number | null;
    beta: number | null;
    profitMargins: number | null;
    revenuePerShare: number | null;
    earningsGrowth: number | null;
}

export interface FundamentalAnalysisResult {
    metrics: FundamentalMetrics;
    fundamentalScore: number; // normalized 0-1
}

export async function getFundamentalAnalysis(symbol: string): Promise<FundamentalAnalysisResult> {
    const info = await yf.quoteSummary(symbol, {
        modules: [
            "financialData",
            "price",
            "defaultKeyStatistics",
            "summaryDetail"
        ]
    });

    const metrics: FundamentalMetrics = {
        marketCap: info.price?.marketCap ?? null,
        peRatio: info.defaultKeyStatistics?.trailingPE ?? info.summaryDetail?.trailingPE ?? null,
        pbRatio: info.defaultKeyStatistics?.priceToBook ?? info.summaryDetail?.priceToBook ?? null,
        eps: info.financialData?.epsTrailingTwelveMonths ?? null,
        roe: info.financialData?.returnOnEquity ?? null,
        debtEquity: info.financialData?.debtToEquity ?? null,
        dividendYield: info.financialData?.dividendYield ?? info.summaryDetail?.dividendYield ?? null,
        totalRevenue: info.financialData?.totalRevenue ?? null,
        freeCashFlow: info.financialData?.freeCashflow ?? null,
        fiftyTwoWeekHigh: info.financialData?.fiftyTwoWeekHigh ?? info.summaryDetail?.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: info.financialData?.fiftyTwoWeekLow ?? info.summaryDetail?.fiftyTwoWeekLow ?? null,
        pegRatio: info.defaultKeyStatistics?.pegRatio ?? null,
        operatingMargins: info.financialData?.operatingMargins ?? info.financialData?.profitMargins ?? null,
        currentRatio: info.financialData?.currentRatio ?? null,
        beta: info.defaultKeyStatistics?.beta ?? info.summaryDetail?.beta ?? null,
        profitMargins: info.financialData?.profitMargins ?? null,
        revenuePerShare: info.financialData?.revenuePerShare ?? null,
        earningsGrowth: info.financialData?.earningsGrowth ?? null
    };

    // Normalization helper
    function normalize(value: number | null, max?: number): number | null {
        if (value === null) return null;
        if (max) return Math.min(value / max, 1);
        return 1 / value;
    }

    const normalized: Record<string, number | null> = {
        peRatio: normalize(metrics.peRatio),
        pbRatio: normalize(metrics.pbRatio),
        eps: normalize(metrics.eps, 10),
        roe: normalize(metrics.roe, 20),
        debtEquity: metrics.debtEquity !== null ? 1 - Math.min(metrics.debtEquity / 2, 1) : null,
        dividendYield: normalize(metrics.dividendYield, 0.05),
        operatingMargins: normalize(metrics.operatingMargins, 0.3),
        currentRatio: normalize(metrics.currentRatio, 2),
        pegRatio: normalize(metrics.pegRatio)
    };

    // Weighted fundamental score — only include metrics that are not null
    const weights: Record<string, number> = {
        peRatio: 0.1,
        pbRatio: 0.05,
        eps: 0.15,
        roe: 0.15,
        debtEquity: 0.1,
        dividendYield: 0.05,
        operatingMargins: 0.15,
        currentRatio: 0.1,
        pegRatio: 0.15
    };

    let score = 0;
    let totalWeight = 0;

    for (const key in normalized) {
        const val = normalized[key];
        const weight = weights[key];
        if (val !== null) {
            score += val * weight;
            totalWeight += weight;
        }
    }

    const fundamentalScore = totalWeight > 0 ? score / totalWeight : 0;

    return { metrics, fundamentalScore: Math.min(fundamentalScore, 1) };
}
