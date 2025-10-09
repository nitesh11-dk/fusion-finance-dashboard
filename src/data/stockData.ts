export interface StockOverview {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  sentiment: string;
  sentimentScore: number;
  lastUpdated: string;
  marketCap: string;
  volume: string;
  sparkline: number[];
}

export interface PriceDataPoint {
  time: string;
  price: number;
}

export interface SentimentDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface NewsItem {
  id: number;
  title: string;
  sentiment: "positive" | "neutral" | "negative";
  source: string;
  time: string;
}

export interface VolumeDataPoint {
  time: string;
  volume: number;
}

export interface Forecast {
  prediction: string;
  confidence: number;
  reason: string;
  targetPrice: number;
  timeframe: string;
}

// Trending stocks list
export const trendingStocks: StockOverview[] = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 178.45,
    change: 1.24,
    changePercent: 0.7,
    sentiment: "Bullish",
    sentimentScore: 68,
    lastUpdated: "10 minutes ago",
    marketCap: "2.8T",
    volume: "52.3M",
    sparkline: [176.5, 177.2, 178.4, 178.0, 177.8, 178.6, 178.45],
  },
  {
    symbol: "TSLA",
    companyName: "Tesla Inc.",
    currentPrice: 247.32,
    change: -2.28,
    changePercent: -0.92,
    sentiment: "Neutral",
    sentimentScore: 55,
    lastUpdated: "12 minutes ago",
    marketCap: "785B",
    volume: "98.7M",
    sparkline: [249.0, 248.3, 247.8, 247.4, 247.3, 247.5, 247.32],
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corp.",
    currentPrice: 338.56,
    change: 1.18,
    changePercent: 0.35,
    sentiment: "Bullish",
    sentimentScore: 70,
    lastUpdated: "8 minutes ago",
    marketCap: "2.5T",
    volume: "31.2M",
    sparkline: [337.0, 337.5, 338.2, 338.6, 338.5, 338.4, 338.56],
  },
];

// Detailed stock data by symbol
export const stockDetails: Record<string, {
  priceData: PriceDataPoint[];
  sentimentData: SentimentDataPoint[];
  newsData: NewsItem[];
  volumeData: VolumeDataPoint[];
  forecast: Forecast;
}> = {
  AAPL: {
    priceData: [
      { time: "09:00", price: 176.5 },
      { time: "10:00", price: 177.2 },
      { time: "11:00", price: 178.4 },
      { time: "12:00", price: 178.0 },
      { time: "13:00", price: 177.8 },
      { time: "14:00", price: 178.6 },
      { time: "15:00", price: 178.45 },
    ],
    sentimentData: [
      { name: "Positive", value: 62, color: "hsl(var(--success))" },
      { name: "Neutral", value: 25, color: "hsl(var(--muted))" },
      { name: "Negative", value: 13, color: "hsl(var(--destructive))" },
    ],
    newsData: [
      {
        id: 1,
        title: "Apple hits record highs after strong earnings",
        sentiment: "positive",
        source: "CNBC",
        time: "2h ago",
      },
      {
        id: 2,
        title: "Analysts predict iPhone 16 to boost profits",
        sentiment: "positive",
        source: "Forbes",
        time: "4h ago",
      },
      {
        id: 3,
        title: "Apple services revenue shows steady growth",
        sentiment: "positive",
        source: "Bloomberg",
        time: "5h ago",
      },
      {
        id: 4,
        title: "Tech stocks face mixed sentiment amid rate concerns",
        sentiment: "neutral",
        source: "Reuters",
        time: "6h ago",
      },
      {
        id: 5,
        title: "Apple Watch sales outperform expectations",
        sentiment: "positive",
        source: "TechCrunch",
        time: "8h ago",
      },
    ],
    volumeData: [
      { time: "09:00", volume: 12000 },
      { time: "10:00", volume: 19000 },
      { time: "11:00", volume: 25000 },
      { time: "12:00", volume: 22000 },
      { time: "13:00", volume: 18000 },
      { time: "14:00", volume: 24000 },
      { time: "15:00", volume: 21000 },
    ],
    forecast: {
      prediction: "Bullish",
      confidence: 82,
      reason: "Positive sentiment + increasing price trend",
      targetPrice: 185.0,
      timeframe: "Next 7 days",
    },
  },
  TSLA: {
    priceData: [
      { time: "09:00", price: 249.0 },
      { time: "10:00", price: 248.3 },
      { time: "11:00", price: 247.8 },
      { time: "12:00", price: 247.4 },
      { time: "13:00", price: 247.3 },
      { time: "14:00", price: 247.5 },
      { time: "15:00", price: 247.32 },
    ],
    sentimentData: [
      { name: "Positive", value: 55, color: "hsl(var(--success))" },
      { name: "Neutral", value: 30, color: "hsl(var(--muted))" },
      { name: "Negative", value: 15, color: "hsl(var(--destructive))" },
    ],
    newsData: [
      {
        id: 1,
        title: "Tesla production numbers exceed expectations",
        sentiment: "positive",
        source: "Bloomberg",
        time: "1h ago",
      },
      {
        id: 2,
        title: "EV market competition intensifies",
        sentiment: "neutral",
        source: "Reuters",
        time: "3h ago",
      },
      {
        id: 3,
        title: "Tesla's new battery technology shows promise",
        sentiment: "positive",
        source: "TechCrunch",
        time: "5h ago",
      },
      {
        id: 4,
        title: "Concerns over supply chain delays",
        sentiment: "negative",
        source: "CNBC",
        time: "7h ago",
      },
      {
        id: 5,
        title: "Tesla expands in Asian markets",
        sentiment: "positive",
        source: "Forbes",
        time: "9h ago",
      },
    ],
    volumeData: [
      { time: "09:00", volume: 22000 },
      { time: "10:00", volume: 28000 },
      { time: "11:00", volume: 25000 },
      { time: "12:00", volume: 23000 },
      { time: "13:00", volume: 26000 },
      { time: "14:00", volume: 29000 },
      { time: "15:00", volume: 27000 },
    ],
    forecast: {
      prediction: "Neutral",
      confidence: 65,
      reason: "Mixed sentiment with slight downward price pressure",
      targetPrice: 245.0,
      timeframe: "Next 7 days",
    },
  },
  MSFT: {
    priceData: [
      { time: "09:00", price: 337.0 },
      { time: "10:00", price: 337.5 },
      { time: "11:00", price: 338.2 },
      { time: "12:00", price: 338.6 },
      { time: "13:00", price: 338.5 },
      { time: "14:00", price: 338.4 },
      { time: "15:00", price: 338.56 },
    ],
    sentimentData: [
      { name: "Positive", value: 70, color: "hsl(var(--success))" },
      { name: "Neutral", value: 20, color: "hsl(var(--muted))" },
      { name: "Negative", value: 10, color: "hsl(var(--destructive))" },
    ],
    newsData: [
      {
        id: 1,
        title: "Microsoft AI services see record adoption",
        sentiment: "positive",
        source: "Forbes",
        time: "2h ago",
      },
      {
        id: 2,
        title: "Azure cloud revenue surpasses expectations",
        sentiment: "positive",
        source: "CNBC",
        time: "4h ago",
      },
      {
        id: 3,
        title: "Microsoft announces new partnership deals",
        sentiment: "positive",
        source: "Bloomberg",
        time: "6h ago",
      },
      {
        id: 4,
        title: "Tech sector shows resilience in Q3",
        sentiment: "positive",
        source: "Reuters",
        time: "8h ago",
      },
      {
        id: 5,
        title: "Microsoft expands data center infrastructure",
        sentiment: "positive",
        source: "TechCrunch",
        time: "10h ago",
      },
    ],
    volumeData: [
      { time: "09:00", volume: 8000 },
      { time: "10:00", volume: 12000 },
      { time: "11:00", volume: 15000 },
      { time: "12:00", volume: 13000 },
      { time: "13:00", volume: 11000 },
      { time: "14:00", volume: 14000 },
      { time: "15:00", volume: 12500 },
    ],
    forecast: {
      prediction: "Bullish",
      confidence: 85,
      reason: "Strong positive sentiment and steady growth trajectory",
      targetPrice: 345.0,
      timeframe: "Next 7 days",
    },
  },
};

export interface Comment {
  id: string;
  text: string;
  author: string;
  source: "Twitter" | "Reddit" | "News";
  timestamp: string;
  sentiment: "positive" | "neutral" | "negative";
}

// Mock comments data for sentiment drill-down
export const stockComments: Record<string, Comment[]> = {
  AAPL: [
    {
      id: "1",
      text: "Apple is doing great today! The new iPhone sales are through the roof! 📱🚀",
      author: "techfan123",
      source: "Twitter",
      timestamp: "2025-10-09T08:00:00Z",
      sentiment: "positive"
    },
    {
      id: "2",
      text: "Not sure about Apple's future with all this competition from Android manufacturers.",
      author: "investor456",
      source: "Reddit",
      timestamp: "2025-10-09T09:00:00Z",
      sentiment: "negative"
    },
    {
      id: "3",
      text: "Apple reported solid quarterly earnings with strong revenue growth across all segments.",
      author: "financeNews",
      source: "News",
      timestamp: "2025-10-09T07:30:00Z",
      sentiment: "positive"
    },
    {
      id: "4",
      text: "AAPL stock price seems stable, no major movements expected in the short term.",
      author: "analyst789",
      source: "Twitter",
      timestamp: "2025-10-09T10:15:00Z",
      sentiment: "neutral"
    },
    {
      id: "5",
      text: "Tim Cook's leadership continues to drive innovation and shareholder value!",
      author: "applebull",
      source: "Reddit",
      timestamp: "2025-10-09T11:00:00Z",
      sentiment: "positive"
    },
    {
      id: "6",
      text: "Concerned about Apple's dependence on China for manufacturing.",
      author: "marketwatcher",
      source: "News",
      timestamp: "2025-10-09T12:00:00Z",
      sentiment: "negative"
    }
  ],
  TSLA: [
    {
      id: "7",
      text: "Tesla's autonomous driving technology is revolutionary! The future is here! 🤖🚗",
      author: "teslafanboy",
      source: "Twitter",
      timestamp: "2025-10-09T08:30:00Z",
      sentiment: "positive"
    },
    {
      id: "8",
      text: "Elon Musk's tweets are causing too much volatility in TSLA stock.",
      author: "trader123",
      source: "Reddit",
      timestamp: "2025-10-09T09:30:00Z",
      sentiment: "negative"
    },
    {
      id: "9",
      text: "Tesla delivered record number of vehicles this quarter despite supply chain challenges.",
      author: "evnews",
      source: "News",
      timestamp: "2025-10-09T07:45:00Z",
      sentiment: "positive"
    },
    {
      id: "10",
      text: "TSLA stock price is highly volatile, proceed with caution if investing.",
      author: "financeguru",
      source: "Twitter",
      timestamp: "2025-10-09T10:30:00Z",
      sentiment: "neutral"
    },
    {
      id: "11",
      text: "Tesla's energy business is growing rapidly, not just about cars anymore!",
      author: "greeninvestor",
      source: "Reddit",
      timestamp: "2025-10-09T11:30:00Z",
      sentiment: "positive"
    },
    {
      id: "12",
      text: "Competition in EV space is heating up, Tesla's market share might decline.",
      author: "marketanalyst",
      source: "News",
      timestamp: "2025-10-09T13:00:00Z",
      sentiment: "negative"
    }
  ],
  MSFT: [
    {
      id: "13",
      text: "Microsoft Azure is dominating the cloud market! Great investment! ☁️💪",
      author: "clouddev",
      source: "Twitter",
      timestamp: "2025-10-09T08:15:00Z",
      sentiment: "positive"
    },
    {
      id: "14",
      text: "Office 365 subscription model is getting expensive for small businesses.",
      author: "smallbizowner",
      source: "Reddit",
      timestamp: "2025-10-09T09:15:00Z",
      sentiment: "negative"
    },
    {
      id: "15",
      text: "Microsoft's partnership with OpenAI shows strong AI strategy going forward.",
      author: "aiexpert",
      source: "News",
      timestamp: "2025-10-09T07:00:00Z",
      sentiment: "positive"
    },
    {
      id: "16",
      text: "MSFT stock has been stable with steady growth, good for long-term investors.",
      author: "longtermtrader",
      source: "Twitter",
      timestamp: "2025-10-09T10:00:00Z",
      sentiment: "neutral"
    },
    {
      id: "17",
      text: "Satya Nadella's leadership has transformed Microsoft into a cloud powerhouse!",
      author: "techleader",
      source: "Reddit",
      timestamp: "2025-10-09T11:15:00Z",
      sentiment: "positive"
    },
    {
      id: "18",
      text: "Windows 11 adoption is slower than expected, might impact revenue.",
      author: "pcuser",
      source: "News",
      timestamp: "2025-10-09T12:30:00Z",
      sentiment: "negative"
    }
  ]
};
