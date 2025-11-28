import { SENTIMENT_COMMENTS } from "@/data/sentimentData";
import { v4 as uuid } from "uuid";

export const getRandomSentimentComments = (stock: string) => {
  // Randomly select 3–5 comments
  const getRandom = (arr: any[]) =>
    arr.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 3);

  const updated = SENTIMENT_COMMENTS.map(comment => ({
    ...comment,
    id: uuid(),
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // random last 7 days
    text: comment.text.replace("{stock}", stock)
  }));

  return {
    positive: getRandom(updated.filter(c => c.sentiment === "positive")),
    neutral: getRandom(updated.filter(c => c.sentiment === "neutral")),
    negative: getRandom(updated.filter(c => c.sentiment === "negative")),
  };
};
