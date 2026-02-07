"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./login.module.css";

const useDelayedInput = (delayMs: number) => {
	const [value, setValue] = useState("");
	const [buffer, setBuffer] = useState("");

	useEffect(() => {
		if (buffer === "") {
			setValue("");
			return;
		}
		const timer = setTimeout(() => {
			setValue(buffer);
		}, delayMs);
		return () => clearTimeout(timer);
	}, [buffer, delayMs]);

	return { value, setBuffer };
};

export default function LoginPage() {
	const router = useRouter();
	const emailField = useDelayedInput(1200);
	const passwordField = useDelayedInput(1600);
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
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);

		setIsLoading(true);

		const result = await signIn("credentials", {
			redirect: false,
			email: emailField.value,
			password: passwordField.value,
		});

		setIsLoading(false);

		if (result?.error) {
			setError("Invalid email or password.");
			return;
		}

		router.push("/");
	};

	return (
		<main className={`${styles.main} ${styles.loginFreeze}`}>
			<div className={styles.card}>
				<h1 className={styles.title}>Welcome back</h1>
				<p className={styles.subtitle}>Sign in with your email and password.</p>
				<form className={styles.form} onSubmit={handleSubmit}>
					<label className={styles.label}>
						Email
						<input
							className={styles.input}
							type="email"
							autoComplete="email"
							required
							value={emailField.value}
							onChange={(event) => emailField.setBuffer(event.target.value)}
						/>
					</label>
					<label className={styles.label}>
						Password
						<input
							className={styles.input}
							type="password"
							autoComplete="current-password"
							required
							value={passwordField.value}
							onChange={(event) => passwordField.setBuffer(event.target.value)}
						/>
					</label>
					{error ? <p className={styles.error}>{error}</p> : null}
					<button
						className={`${styles.button} ${styles.catchButton} ${isCatchReady ? styles.catchReady : ""}`}
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
				<p className={styles.footer}>
					No account yet?{" "}
					<Link className={styles.link} href="/auth/register">
						Create one
					</Link>
				</p>
			</div>
		</main>
	);
}
