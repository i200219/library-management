"use client";

import { Session } from "next-auth";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Header = ({ session }: { session: Session }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("users");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <header className="admin-header py-4 sm:py-6 px-4 sm:px-8 bg-gradient-to-r from-primary to-secondary">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
        <div className="w-full lg:w-auto">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
            {session?.user?.name}
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300">
            Monitor all of your users and books here
          </p>
        </div>

        <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 lg:gap-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            <div className="relative w-full sm:w-[150px] lg:w-[200px]">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/50 focus:ring-white/50 text-sm">
                  <SelectValue placeholder="Search type" />
                </SelectTrigger>
                <SelectContent className="bg-white/5 border-white/20 text-white">
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="borrowings">Borrowings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative w-full sm:w-[250px] lg:w-[400px]">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-white/50 focus:ring-white/50 text-sm pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white h-6 w-6"
                  onClick={handleClearSearch}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim()}
              className="bg-white/10 hover:bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-r-transparent rounded-full mr-2"></span>
                  <span className="hidden sm:inline">Searching...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                "Search"
              )}
            </Button>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-white/5 rounded-xl border border-white/20 backdrop-blur-sm">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Results ({searchResults.length})</h3>
          <div className="space-y-2 sm:space-y-3">
            {searchResults.map((result, index) => (
              <div
                key={result.id}
                className="p-3 sm:p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
              >
                {searchType === "users" && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">{result.name}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{result.email}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{result.role}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300">
                      Last active: {new Date(result.lastActivityDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {searchType === "books" && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">{result.title}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{result.author}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{result.genre}</p>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-xs sm:text-sm text-green-400">{result.availableCopies} available</p>
                      <p className="text-xs sm:text-sm text-gray-300">/{result.totalCopies} total</p>
                    </div>
                  </div>
                )}

                {searchType === "borrowings" && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-medium text-white text-sm sm:text-base">{result.bookTitle}</p>
                      <p className="text-xs sm:text-sm text-gray-300">{result.userName}</p>
                      <p className="text-xs sm:text-sm text-gray-300">
                        {result.status}
                      </p>
                    </div>
                    <div className="flex flex-col items-start sm:items-end text-xs sm:text-sm text-gray-300">
                      <p>Borrowed: {new Date(result.borrowDate).toLocaleDateString()}</p>
                      <p>Due: {new Date(result.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
