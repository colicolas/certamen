"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Input from "@/components/FormTextInput";
import FormButton from "@/components/FormButton";

export default function SignIn() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", { redirect: false, email: emailOrUsername, password });
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
            <label htmlFor="emailOrUsername" className="block text-gray-700 text-xs font-bold mb-2 uppercase">
              Email/Username <span className="text-red-500">*</span>
            </label>
            <Input
              id="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
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
            <FormButton text="Log In" style="text-white bg-indigo-600 hover:bg-indigo-400" />
            <FormButton text="With Google" style="border-indigo-600 text-gray-800 bg-beige-300 hover:bg-beige-500" onClick={() => signIn("google")} type="button" />
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
