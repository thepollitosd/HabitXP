import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakCounter({
  currentStreak = 0,
  longestStreak = 0,
}: StreakCounterProps) {
  return (
    <Card className="w-full bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Flame className="h-5 w-5 mr-2 text-orange-500" />
          Your Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-center">
            <p className="text-sm text-gray-500">Current</p>
            <p className="text-3xl font-bold text-orange-500">
              {currentStreak}
            </p>
            <p className="text-xs text-gray-500">days</p>
          </div>

          <div className="h-12 w-px bg-gray-200"></div>

          <div className="text-center">
            <p className="text-sm text-gray-500">Longest</p>
            <p className="text-3xl font-bold text-red-500">{longestStreak}</p>
            <p className="text-xs text-gray-500">days</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
