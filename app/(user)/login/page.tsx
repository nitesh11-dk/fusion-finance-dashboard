"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { loginUser } from "./login"; // server action
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);

      const res = await loginUser(formData);

      if (res.success) {
        toast.success(res.message || "✅ Logged in successfully!", {
          autoClose: 2000,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: res.user.username,
            role: res.user.role,
            loggedIn: true,
          })
        );

        router.push("/form"); // Redirect all users to "/"
      } else {
        toast.error(res.message || "❌ Login failed, please try again");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err?.message || "🚨 Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100 px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm mb-1 font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-1 font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
