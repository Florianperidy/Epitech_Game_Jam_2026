"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./login.module.css";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailBuffer, setEmailBuffer] = useState("");
	const [passwordBuffer, setPasswordBuffer] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
	const [isCatchReady, setIsCatchReady] = useState(false);
	const catchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const resetCatchTimer = () => {
		if (catchTimer.current) {
			clearTimeout(catchTimer.current);
		}
		setIsCatchReady(false);
	};

	const armCatchTimer = () => {
		if (isCatchReady || catchTimer.current) {
			return;
		}
		catchTimer.current = setTimeout(() => {
			setIsCatchReady(true);
			catchTimer.current = null;
		}, 1100);
	};

	const dodgeButton = () => {
		const nextX = Math.floor(Math.random() * 140) - 70;
		const nextY = Math.floor(Math.random() * 90) - 45;
		setButtonOffset({ x: nextX, y: nextY });
	};
	useEffect(() => {
		if (emailBuffer === "") {
			setEmail("");
			return;
		}
		const timer = setTimeout(() => {
			setEmail(emailBuffer);
		}, 1200);
		return () => clearTimeout(timer);
	}, [emailBuffer]);

	useEffect(() => {
		if (passwordBuffer === "") {
			setPassword("");
			return;
		}
		const timer = setTimeout(() => {
			setPassword(passwordBuffer);
		}, 1600);
		return () => clearTimeout(timer);
	}, [passwordBuffer]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		setIsLoading(true);

		const result = await signIn("credentials", {
			redirect: false,
			email,
			password,
		});

		setIsLoading(false);

		if (result?.error) {
			setError("Invalid email or password.");
			return;
		}

		router.push("/");
	};

	return (
		<main className={`flex min-h-screen items-center justify-center bg-zinc-50 px-6 ${styles.loginFreeze}`}>
			<div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
				<h1 className="text-2xl font-semibold text-zinc-900">Welcome back</h1>
				<p className="mt-2 text-sm text-zinc-500">
					Sign in with your email and password.
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
							onChange={(event) => setEmailBuffer(event.target.value)}
						/>
					</label>
					<label className="block text-sm font-medium text-zinc-700">
						Password
						<input
							className="mt-2 w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(event) => setPasswordBuffer(event.target.value)}
						/>
					</label>
					{error ? <p className="text-sm text-red-600">{error}</p> : null}
					<button
						className={`w-full rounded-lg bg-zinc-900 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60 ${styles.catchButton} ${isCatchReady ? styles.catchReady : ""}`}
						type="submit"
						disabled={isLoading}
						style={{ transform: `translate(${buttonOffset.x}px, ${buttonOffset.y}px)` }}
						onMouseEnter={armCatchTimer}
						onFocus={armCatchTimer}
						onMouseMove={() => {
							if (!isCatchReady) {
								dodgeButton();
							}
						}}
						onClick={(event) => {
							if (!isCatchReady) {
								event.preventDefault();
								dodgeButton();
								return;
							}
							setButtonOffset({ x: 0, y: 0 });
							resetCatchTimer();
						}}
					>
						{isLoading ? "Signing in..." : "Sign in"}
					</button>
				</form>
				<p className="mt-6 text-sm text-zinc-500">
					No account yet?{" "}
					<Link className="font-medium text-zinc-900" href="/auth/register">
						Create one
					</Link>
				</p>
			</div>
		</main>
	);
}
