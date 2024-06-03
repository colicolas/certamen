"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Input from "@/components/FormTextInput";
import LightButton from "@/components/LightButton";
import DarkButton from "@/components/DarkButton";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", { redirect: false, email, password });
      if (result.error) {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to log in. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-beige-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-beige-300 rounded-md shadow-md">
        <h2 className="text-2xl font-bold text-black">Welcome back!</h2>
        {error && <div className="text-red-500">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-xs font-bold mb-2 uppercase">
              Email/Username <span className="text-red-500">*</span>
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-xs font-bold mb-2 uppercase">
              Password <span className="text-red-500">*</span>
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Log In
            </button>
            <button
              type="button"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => signIn("google")}
            >
              With Google
            </button>
          </div>
          <div className="mt-4">
            <a
              href="#"
              className="text-sm text-indigo-600 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Need an account?{" "}
          <a href="/auth/register" className="text-indigo-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
