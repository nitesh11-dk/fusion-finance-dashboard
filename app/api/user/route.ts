// app/api/user/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";
import { getUserFromCookies } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        await connect();

        // ✅ Get user from token stored in cookies
        const user = await getUserFromCookies();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // ✅ Fetch user details from DB
        const userData = await User.findById(user.id).select("-password"); // exclude password

        if (!userData) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user: userData });
    } catch (error: any) {
        console.error("Error fetching user details:", error);
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}
