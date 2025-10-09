import mongoose from 'mongoose';

const SentimentSchema = new mongoose.Schema({
    stock_name: { type: String, required: true },
    date_analyzed: { type: Date, required: true },
    sentiment_analysis: {
        overall_sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true },
        reasoning: { type: String, required: true }
    },
    top_news: { type: [String], default: [] }
}, {
    timestamps: true
});

// Avoid recompiling model during hot reloads
export default mongoose.models.Sentiment || mongoose.model('Sentiment', SentimentSchema);
