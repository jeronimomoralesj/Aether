import { redirect } from "next/navigation";

export default function DashboardPage() {
  // Redirect /dashboard → /dashboard/inventory
  redirect("/dashboard/inventory");
}
