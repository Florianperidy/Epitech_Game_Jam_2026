"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error ?? "Unable to create account.");
      return;
    }

    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    router.push("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Create account</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Use an email and password to get started.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-zinc-700">
            Email
            <input
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-zinc-700">
            Password
            <input
              className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link className="font-medium text-zinc-900" href="/auth/login">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
