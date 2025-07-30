import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./components/AdminDashboard";

export default async function AdminPage() {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/books');
  }

  return <AdminDashboard session={session} />;
}
