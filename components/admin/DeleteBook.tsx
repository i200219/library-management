"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBook } from "@/lib/actions/reservation";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteBookProps {
  bookId: string;
  bookTitle: string;
  className?: string;
}

const DeleteBook = ({ bookId, bookTitle, className }: DeleteBookProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await deleteBook(bookId);

      if (result.success) {
        toast({
          title: "Book Deleted",
          description: result.message,
        });
        
        setIsOpen(false);
        
        // Navigate back to books list
        router.push("/admin/books");
        router.refresh();
      } else {
        toast({
          title: "Deletion Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while deleting the book",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className={className}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Book
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Book</DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to delete "{bookTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Warning:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• This will permanently delete the book from the library</li>
              <li>• All borrow history will be removed</li>
              <li>• All reservation history will be removed</li>
              <li>• This action cannot be undone</li>
            </ul>
          </div>
          
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Note:</h4>
            <p className="text-sm text-yellow-700">
              If there are active borrows or reservations, the deletion will be prevented. 
              Please ensure all copies are returned and all reservations are cancelled first.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Book"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBook;