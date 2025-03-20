import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import { Habit } from "@/types/habits";

interface HabitCardProps {
  habit: Habit;
  isCompleted?: boolean;
  onComplete?: (habitId: string) => void;
}

export default function HabitCard({
  habit,
  isCompleted = false,
  onComplete,
}: HabitCardProps) {
  const difficultyColors = {
    1: "bg-green-100 text-green-800",
    2: "bg-yellow-100 text-yellow-800",
    3: "bg-red-100 text-red-800",
  };

  const difficultyLabels = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  const getDifficultyColor = (difficulty: number) => {
    return (
      difficultyColors[difficulty as keyof typeof difficultyColors] ||
      difficultyColors[1]
    );
  };

  const getDifficultyLabel = (difficulty: number) => {
    return (
      difficultyLabels[difficulty as keyof typeof difficultyLabels] ||
      difficultyLabels[1]
    );
  };

  return (
    <Card
      className={`w-full transition-all duration-200 ${isCompleted ? "border-green-500 bg-green-50" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{habit.name}</CardTitle>
          <Badge className={getDifficultyColor(habit.difficulty)}>
            {getDifficultyLabel(habit.difficulty)}
          </Badge>
        </div>
        <CardDescription>{habit.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{habit.frequency}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onComplete && onComplete(habit.id)}
          variant={isCompleted ? "outline" : "default"}
          className={`w-full ${isCompleted ? "border-green-500 text-green-700" : ""}`}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Completed
            </>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
