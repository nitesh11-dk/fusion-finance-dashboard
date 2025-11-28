"use server";

import bcrypt from "bcryptjs";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";

export async function registerUser({ username, password }) {
  try {
    await connect();

    username = username.trim().toLowerCase();

    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return { success: false, message: "Username must contain only lowercase letters and numbers." };
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return { success: false, message: "⚠️ Username already exists" };

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashed,
      interestShares: [],
      level: "Beginner",
    });

    return {
      success: true,
      message: "🎉 Registered successfully",
      user: {
        id: newUser._id.toString(),
        username: newUser.username,
        level: newUser.level,
      },
    };

  } catch (err) {
    console.error("Registration error:", err);
    return { success: false, message: "🚨 Server error during registration" };
  }
}
