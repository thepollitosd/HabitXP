import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface XPCounterProps {
  totalXP: number;
}

export default function XPCounter({ totalXP = 0 }: XPCounterProps) {
  return (
    <Card className="w-full bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-purple-500" />
          Total XP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <p className="text-4xl font-bold text-purple-600">{totalXP}</p>
          <p className="text-lg ml-1 text-purple-400">XP</p>
        </div>
      </CardContent>
    </Card>
  );
}
