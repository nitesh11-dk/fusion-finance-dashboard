"use server";

import bcrypt from "bcryptjs";
import connect from "@/lib/mongo";
import User from "@/lib/models/User";

export async function registerUser(formData: {
  username: string;
  password: string;
  role?: "admin" | "supervisor" | "user";
}) {
  try {
    let { username, password, role = "admin" } = formData;

    await connect();

    username = username.trim().toLowerCase();

    const usernameRegex = /^[a-z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return {
        success: false,
        message:
          "Username must contain only lowercase letters and numbers (no spaces or special characters).",
      };
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return { success: false, message: "⚠️ Username already exists" };
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashed,
      role,
    });

    return { success: true, message: "🎉 Registered successfully", user };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "🚨 Server error during registration",
    };
  }
}
