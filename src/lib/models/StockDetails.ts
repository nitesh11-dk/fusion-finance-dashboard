import mongoose, { Schema, Document } from "mongoose";

export interface IStockDetail extends Document {
    symbol: string;
    companyName: string;
    currentPrice: number;
    marketCap: number;
    volume: number;
    priceData: { time: Date; open: number; high: number; low: number; close: number; volume: number }[];
    sentimentData: any;
    newsData: { title: string; link: string; publisher: string; providerPublishTime: number }[];
    lastUpdated: Date;
}

const StockDetailSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    volume: { type: Number, required: true },
    priceData: { type: [Object], required: true },
    sentimentData: { type: Schema.Types.Mixed, default: null },
    newsData: { type: [Object], default: [] },
    lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.StockDetail || mongoose.model<IStockDetail>("StockDetail", StockDetailSchema);
