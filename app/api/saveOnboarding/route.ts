"use server";

import { NextResponse } from "next/server";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connect();

        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const body = await req.json();
        const { interestShares, level } = body;

        if (!Array.isArray(interestShares) || interestShares.length === 0) {
            return NextResponse.json({ success: false, message: "Please select stocks" }, { status: 400 });
        }

        if (!level) {
            return NextResponse.json({ success: false, message: "Please select experience level" }, { status: 400 });
        }

        // Update user
        await User.findByIdAndUpdate(user.id, {
            interestShares,
            level,
        });

        return NextResponse.json({ success: true, message: "Onboarding saved successfully" });
    } catch (err: any) {
        console.error("Onboarding save error:", err);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
