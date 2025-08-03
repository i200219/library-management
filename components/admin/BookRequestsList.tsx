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
    <Table className="bg-white">
      <TableHeader>
        <TableRow className="border-b border-gray-200">
          <TableHead className="text-gray-700 font-semibold">Student Name</TableHead>
          <TableHead className="text-gray-700 font-semibold">Book</TableHead>
          <TableHead className="text-gray-700 font-semibold">Borrow Date</TableHead>
          <TableHead className="text-gray-700 font-semibold">Due Date</TableHead>
          <TableHead className="text-gray-700 font-semibold">Status</TableHead>
          <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
            <TableCell className="text-gray-900 font-medium">{request.userName}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                {request.bookCoverUrl && (
                  <div className="w-10 h-12 flex-shrink-0">
                    <img
                      src={request.bookCoverUrl}
                      alt={request.bookTitle}
                      className="w-full h-full object-cover rounded shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="text-gray-900 font-medium">{request.bookTitle}</div>
              </div>
            </TableCell>
            <TableCell className="text-gray-700">{new Date(request.borrowDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-gray-700">{new Date(request.dueDate).toLocaleDateString()}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              }`}>
                {request.status}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                {request.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(request.id)}
                      className="bg-red-600 hover:bg-red-700"
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
