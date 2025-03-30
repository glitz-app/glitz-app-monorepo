import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionClaims } = auth();

  // If the user does not have the admin role, redirect them to the home page
  if (sessionClaims?.metadata?.role !== "admin") {
    redirect("/");
  }

  return <>{children}</>;
}
