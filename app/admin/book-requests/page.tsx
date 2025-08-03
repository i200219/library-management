import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import BookRequestsList from "@/components/admin/BookRequestsList";

export default async function BookRequestsPage() {
  const session = await auth();

  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/books');
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/borrow-requests`, {  
      next: { revalidate: 60 },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.user?.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch book requests: ${response.statusText}`);
    }

    const bookRequests = await response.json();

    return (
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold mb-8">Book Requests</h1>
        <BookRequestsList 
          requests={bookRequests}
          session={session}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading book requests:", error);
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-20">
          <p className="text-xl text-light-100">Error loading book requests. Please try again later.</p>
        </div>
      </div>
    );
  }
}