import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/");
  }

  return children;
}
