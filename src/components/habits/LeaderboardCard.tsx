import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Medal } from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  position: number;
  avatarUrl?: string;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
  title?: string;
}

export default function LeaderboardCard({
  users = [],
  title = "Weekly Leaderboard",
}: LeaderboardCardProps) {
  const getPositionColor = (position: number) => {
    switch (position) {
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-gray-400";
      case 3:
        return "bg-amber-600";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Medal className="h-5 w-5 mr-2 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No data available</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white mr-3 ${getPositionColor(user.position)}`}
                  >
                    {user.position}
                  </div>
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage
                      src={
                        user.avatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
                <span className="font-bold">{user.xp} XP</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
