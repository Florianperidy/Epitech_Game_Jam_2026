import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = Boolean(session?.user);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-base">
        {isLoggedIn ? "You are logged in." : "You are not logged in."}
      </p>
    </main>
  );
}
