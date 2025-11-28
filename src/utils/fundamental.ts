import yf from "yahoo-finance2";

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
  fundamentalScore: number; // 0-1 normalized
}

// clamp number into allowed range
const clamp = (num: number, min = 0, max = 1) => Math.min(Math.max(num, min), max);

export async function getFundamentalAnalysis(symbol: string): Promise<FundamentalAnalysisResult> {
  const info = await yf.quoteSummary(symbol, {
    modules: ["financialData", "price", "defaultKeyStatistics", "summaryDetail"]
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
    fiftyTwoWeekHigh: info.summaryDetail?.fiftyTwoWeekHigh ?? null,
    fiftyTwoWeekLow: info.summaryDetail?.fiftyTwoWeekLow ?? null,
    pegRatio: info.defaultKeyStatistics?.pegRatio ?? null,
    operatingMargins: info.financialData?.operatingMargins ?? null,
    currentRatio: info.financialData?.currentRatio ?? null,
    beta: info.defaultKeyStatistics?.beta ?? null,
    profitMargins: info.financialData?.profitMargins ?? null,
    revenuePerShare: info.financialData?.revenuePerShare ?? null,
    earningsGrowth: info.financialData?.earningsGrowth ?? null,
  };

  // =============================
  // SMART NORMALIZATION LOGIC
  // =============================

  const normalized = {
    peRatio: metrics.peRatio !== null ? clamp(1 / Math.max(metrics.peRatio, 5)) : null,  // 5<=good, high pe bad
    pbRatio: metrics.pbRatio !== null ? clamp(1 / Math.max(metrics.pbRatio, 1)) : null, // PB 1-3 ideal
    eps: metrics.eps !== null ? clamp(metrics.eps / 20) : null, 
    roe: metrics.roe !== null ? clamp(metrics.roe / 20) : null, 
    debtEquity: metrics.debtEquity !== null ? clamp(1 - metrics.debtEquity / 2) : null, 
    dividendYield: metrics.dividendYield !== null ? clamp(metrics.dividendYield / 0.05) : null, 
    operatingMargins: metrics.operatingMargins !== null ? clamp(metrics.operatingMargins / 0.30) : null, 
    currentRatio: metrics.currentRatio !== null ? clamp(metrics.currentRatio / 2) : null,
    pegRatio: metrics.pegRatio !== null 
      ? metrics.pegRatio < 1 
        ? 1 
        : clamp(1 / metrics.pegRatio)
      : null,
  };

  // =============================
  // WEIGHT SYSTEM
  // =============================

  const weights = {
    peRatio: 0.1,
    pbRatio: 0.05,
    eps: 0.15,
    roe: 0.15,
    debtEquity: 0.1,
    dividendYield: 0.05,
    operatingMargins: 0.15,
    currentRatio: 0.1,
    pegRatio: 0.15,
  };

  let score = 0;
  let totalWeight = 0;

  for (const key in normalized) {
    const val = normalized[key as keyof typeof normalized];
    const weight = weights[key as keyof typeof weights];
    if (val !== null) {
      score += val * weight;
      totalWeight += weight;
    }
  }

  const fundamentalScore = totalWeight > 0 ? score / totalWeight : 0;

  return {
    metrics,
    fundamentalScore: clamp(fundamentalScore)
  };
}
