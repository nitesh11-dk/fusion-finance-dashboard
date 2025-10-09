import mongoose, { Schema, Document } from "mongoose";

export interface IStock extends Document {
    symbol: string;
    companyName: string;
    currentPrice: number;
    marketCap: number;
    volume: number;
    sparkline: number[];
    lastUpdated: Date;
}

const StockSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    companyName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    volume: { type: Number, required: true },
    sparkline: { type: [Number], required: true },
    lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Stock || mongoose.model<IStock>("Stock", StockSchema);
