import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    role: "admin" | "supervisor" | "user";
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[a-z0-9]+$/, "Username can only contain lowercase letters and numbers"],
        },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["admin", "supervisor", "user"], // ✅ added user role
            default: "user",
        },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
