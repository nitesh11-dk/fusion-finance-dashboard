import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI: string | undefined = process.env.MONGO_URI;
if (!MONGODB_URI) {
    throw new Error("Please define the MONGO_URI environment variable");
}

// Extend global to include mongoose cache
declare global {
    // eslint-disable-next-line no-var
    var mongoose: {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
    };
}

let cached = global.mongoose || { conn: null, promise: null };

export default async function connect(): Promise<Mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(`${MONGODB_URI}/trend-seer`)
            .then((mongoose) => mongoose);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    global.mongoose = cached;
    return cached.conn;
}
