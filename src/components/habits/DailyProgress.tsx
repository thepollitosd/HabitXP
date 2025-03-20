import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface DailyProgressProps {
  completed: number;
  total: number;
}

export default function DailyProgress({
  completed = 0,
  total = 0,
}: DailyProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
          Daily Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm">
            <p className="text-gray-500">
              <span className="font-medium text-green-600">{completed}</span> of{" "}
              {total} habits completed
            </p>
            <p className="font-medium">{percentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
