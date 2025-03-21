import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Users, UserPlus, Check, X, Trophy } from "lucide-react";
import { toast } from "../ui/use-toast";

interface Friend {
  friend_id: string;
  full_name: string;
  avatar_url: string;
  total_xp: number;
  status: string;
}

export default function FriendsList() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchFriends() {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_friends", {
          user_id_param: user.id,
        });

        if (error) throw error;

        // Separate accepted friends and pending requests
        const accepted = data.filter((f: Friend) => f.status === "accepted");
        const pending = data.filter((f: Friend) => f.status === "pending");

        setFriends(accepted);
        setPendingRequests(pending);
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast({
          title: "Error",
          description: "Failed to load friends. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();

    // Subscribe to changes in the friends table
    const friendsSubscription = supabase
      .channel("friends-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        () => fetchFriends(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(friendsSubscription);
    };
  }, [user]);

  const handleAcceptRequest = async (friendId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc("respond_to_friend_request", {
        user_id_param: user.id,
        requester_id: friendId,
        accept: true,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Friend request accepted!",
        });
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to accept friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRejectRequest = async (friendId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc("respond_to_friend_request", {
        user_id_param: user.id,
        requester_id: friendId,
        accept: false,
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success",
          description: "Friend request rejected.",
        });
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      toast({
        title: "Error",
        description: "Failed to reject friend request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner size="md" text="Loading friends..." />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-blue-500" />
          Friends
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingRequests.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Friend Requests
            </h3>
            <div className="space-y-2">
              {pendingRequests.map((request) => (
                <div
                  key={request.friend_id}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={
                          request.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.full_name}`
                        }
                        alt={request.full_name}
                      />
                      <AvatarFallback>
                        {request.full_name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.full_name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-green-600"
                      onClick={() => handleAcceptRequest(request.friend_id)}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-red-600"
                      onClick={() => handleRejectRequest(request.friend_id)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {friends.length === 0 ? (
          <div className="text-center py-6">
            <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">No friends yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Add friends to see them on your leaderboard
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.friend_id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={
                        friend.avatar_url ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.full_name}`
                      }
                      alt={friend.full_name}
                    />
                    <AvatarFallback>
                      {friend.full_name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{friend.full_name}</span>
                </div>
                <div className="flex items-center text-sm font-semibold">
                  <Trophy className="h-4 w-4 text-yellow-500 mr-1" />
                  {friend.total_xp} XP
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
