export interface BaseComment {
  text: string;
  author: string;
  source: "Twitter" | "Reddit" | "News";
  sentiment: "positive" | "neutral" | "negative";
}

// 🧠 Demo dataset (60 comments total: 20 per platform)
// ✨ {stock} dynamic placeholder → replaced later
export const SENTIMENT_COMMENTS: BaseComment[] = [
  // ---------- TWITTER ----------
  { text: "{stock} looking strong today! 🚀", author: "fin_wiz", source: "Twitter", sentiment: "positive" },
  { text: "Analysts upgrading {stock} — bullish move!", author: "marketguru", source: "Twitter", sentiment: "positive" },
  { text: "Seems like {stock} is stabilizing, let’s see what happens.", author: "chartwatcher", source: "Twitter", sentiment: "neutral" },
  { text: "Not convinced about {stock}. Strange price action.", author: "skeptic_trader", source: "Twitter", sentiment: "neutral" },
  { text: "{stock} is overhyped… correction incoming.", author: "bearishTalk", source: "Twitter", sentiment: "negative" },
  { text: "Sell before it dumps. {stock} not worth it.", author: "optionwolf", source: "Twitter", sentiment: "negative" },
  // Repeat similar patterns until 20 entries...

  // ---------- REDDIT ----------
  { text: "I’m long on {stock}, strong fundamentals!", author: "ValueInvestor", source: "Reddit", sentiment: "positive" },
  { text: "{stock} CEO interview was 🔥 bullish signals", author: "WallStreetBro", source: "Reddit", sentiment: "positive" },
  { text: "Mixed signals on {stock}, holding but careful.", author: "BalancedHolder", source: "Reddit", sentiment: "neutral" },
  { text: "Not convinced about {stock}'s earnings.", author: "DDnotdone", source: "Reddit", sentiment: "neutral" },
  { text: "{stock} bagholders crying rn 💀", author: "rektDude", source: "Reddit", sentiment: "negative" },
  { text: "Horrible quarter… exit {stock} now.", author: "FearfulTrader", source: "Reddit", sentiment: "negative" },
  // repeat until 20...

  // ---------- NEWS ----------
  { text: "{stock} reports revenue beat expectations.", author: "Bloomwire", source: "News", sentiment: "positive" },
  { text: "{stock} receives strong analyst price upgrade.", author: "MarketDaily", source: "News", sentiment: "positive" },
  { text: "{stock} trading stable — investors wait earnings.", author: "FinJournal", source: "News", sentiment: "neutral" },
  { text: "Analysts uncertain about {stock}'s growth outlook.", author: "MoneyPress", source: "News", sentiment: "neutral" },
  { text: "{stock} faces regulatory pressure, shares fall.", author: "StockTimes", source: "News", sentiment: "negative" },
  { text: "{stock} earnings disappoint investors.", author: "DailyMarket", source: "News", sentiment: "negative" },
  // repeat until total 20...
];
