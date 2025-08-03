import { BookRequest } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BookRequestsListProps {
  requests: BookRequest[];
  session: any;
}

export default function BookRequestsList({ requests, session }: BookRequestsListProps) {
  const handleApprove = async (requestId: string) => {
    try {
      const response = await fetch(`/api/borrow-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({
          id: requestId,
          status: 'APPROVED'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to approve request');
      }

      // Refresh the page after successful approval
      window.location.reload();
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Failed to approve request. Please try again.');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/borrow-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.user.token}`
        },
        body: JSON.stringify({
          id: requestId,
          status: 'REJECTED'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject request');
      }

      // Refresh the page after successful rejection
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Failed to reject request. Please try again.');
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-light-100">No pending book requests</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student Name</TableHead>
          <TableHead>Book Title</TableHead>
          <TableHead>Borrow Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{request.userName}</TableCell>
            <TableCell>{request.bookTitle}</TableCell>
            <TableCell>{new Date(request.borrowDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(request.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>{request.status}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                {request.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
