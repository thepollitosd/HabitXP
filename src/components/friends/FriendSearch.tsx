import { useState } from "react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Search, UserPlus, Check, Clock } from "lucide-react";
import { toast } from "../ui/use-toast";

interface UserSearchResult {
  user_id: string;
  full_name: string;
  avatar_url: string;
  friendship_status: string;
}

export default function FriendSearch() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim() || !user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("search_users", {
        search_term: searchTerm,
        current_user_id: user.id,
      });

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      toast({
        title: "Error",
        description: "Failed to search users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc("send_friend_request", {
        sender_id: user.id,
        recipient_id: userId,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Friend request sent!",
        });

        // Update the local state to reflect the pending request
        setSearchResults(
          searchResults.map((result) =>
            result.user_id === userId
              ? { ...result, friendship_status: "pending" }
              : result,
          ),
        );
      } else {
        toast({
          title: "Notice",
          description:
            "Could not send friend request. You may already be friends.",
        });
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast({
        title: "Error",
        description: "Failed to send friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <LoadingSpinner className="h-4 w-4" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          <span className="ml-2">Search</span>
        </Button>
      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-2">
          {searchResults.map((result) => (
            <div
              key={result.user_id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={
                      result.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.full_name}`
                    }
                    alt={result.full_name}
                  />
                  <AvatarFallback>
                    {result.full_name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{result.full_name}</div>
                </div>
              </div>

              {result.friendship_status === "none" ? (
                <Button
                  size="sm"
                  onClick={() => handleSendRequest(result.user_id)}
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add Friend
                </Button>
              ) : result.friendship_status === "pending" ? (
                <Button size="sm" variant="outline" disabled>
                  <Clock className="h-4 w-4 mr-1" />
                  Request Sent
                </Button>
              ) : result.friendship_status === "accepted" ? (
                <Button size="sm" variant="outline" disabled>
                  <Check className="h-4 w-4 mr-1" />
                  Friends
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      ) : searchTerm && !loading ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No users found</p>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search term
          </p>
        </div>
      ) : null}
    </div>
  );
}
