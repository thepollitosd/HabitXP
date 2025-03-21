import { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Habit, HabitCompletion } from "@/types/habits";
import HabitCard from "../habits/HabitCard";
import CreateHabitDialog from "../habits/CreateHabitDialog";
import DailyProgress from "../habits/DailyProgress";
import StreakCounter from "../habits/StreakCounter";
import XPCounter from "../habits/XPCounter";
import LeaderboardCard from "../habits/LeaderboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Trophy, Calendar, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "../ui/use-toast";

export default function HabitDashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [totalXP, setTotalXP] = useState(0);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<
    "weekly" | "monthly"
  >("weekly");
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch user's habits
  useEffect(() => {
    if (!user) return;

    async function fetchHabits() {
      setLoading(true);
      try {
        // Fetch habits
        const { data: habitsData, error: habitsError } = await supabase
          .from("habits")
          .select("*")
          .eq("user_id", user.id);

        if (habitsError) throw habitsError;

        // Fetch today's completions
        const today = new Date().toISOString().split("T")[0];
        const { data: completionsData, error: completionsError } =
          await supabase
            .from("habit_completions")
            .select("habit_id")
            .eq("user_id", user.id)
            .gte("completed_at", `${today}T00:00:00`)
            .lte("completed_at", `${today}T23:59:59`);

        if (completionsError) throw completionsError;

        // Fetch streak data
        const { data: streakData, error: streakError } = await supabase
          .from("streaks")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (streakError && streakError.code !== "PGRST116") throw streakError;

        // Fetch total XP
        const { data: xpData, error: xpError } = await supabase.rpc(
          "get_total_xp",
          { user_id_param: user.id },
        );

        if (xpError) throw xpError;

        setHabits(habitsData || []);
        setCompletedHabits(completionsData?.map((c) => c.habit_id) || []);
        setStreak({
          current: streakData?.current_streak || 0,
          longest: streakData?.longest_streak || 0,
        });
        setTotalXP(xpData || 0);
      } catch (error) {
        console.error("Error fetching habit data:", error);
        toast({
          title: "Error",
          description: "Failed to load your habits. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, [user]);

  // Fetch leaderboard data
  useEffect(() => {
    if (!user) return;

    async function fetchLeaderboard() {
      try {
        const { data, error } = await supabase.rpc(
          leaderboardPeriod === "weekly"
            ? "get_weekly_leaderboard"
            : "get_monthly_leaderboard",
          { limit_param: 10 },
        );

        if (error) throw error;

        // Format leaderboard data
        const formattedData = data.map((item: any, index: number) => ({
          id: item.user_id,
          name: item.full_name || `User ${item.user_id.substring(0, 4)}`,
          xp: item.total_xp,
          position: index + 1,
          avatarUrl: item.avatar_url,
        }));

        setLeaderboard(formattedData);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    }

    fetchLeaderboard();

    // Subscribe to changes in the xp table
    const xpSubscription = supabase
      .channel("xp-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "xp" },
        () => fetchLeaderboard(),
      )
      .subscribe();

    // Subscribe to changes in the streaks table
    const streaksSubscription = supabase
      .channel("streaks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "streaks" },
        () => {
          // Fetch streak data when it changes
          supabase
            .from("streaks")
            .select("*")
            .eq("user_id", user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setStreak({
                  current: data.current_streak || 0,
                  longest: data.longest_streak || 0,
                });
              }
            });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(xpSubscription);
      supabase.removeChannel(streaksSubscription);
    };
  }, [user, leaderboardPeriod]);

  // Handle habit creation
  const handleCreateHabit = async (habitData: {
    name: string;
    description: string;
    frequency: string;
    difficulty: number;
  }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("habits")
        .insert([
          {
            user_id: user.id,
            name: habitData.name,
            description: habitData.description || null,
            frequency: habitData.frequency,
            difficulty: habitData.difficulty,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setHabits([...habits, data]);
      toast({
        title: "Success",
        description: "New habit created successfully!",
      });
    } catch (error) {
      console.error("Error creating habit:", error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle habit completion
  const handleCompleteHabit = async (habitId: string) => {
    if (!user) return;

    try {
      // Mark habit as complete
      const { error } = await supabase.from("habit_completions").insert([
        {
          habit_id: habitId,
          user_id: user.id,
          completed_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      // Update local state
      const updatedCompletedHabits = [...completedHabits, habitId];
      setCompletedHabits(updatedCompletedHabits);

      // Check if all habits are completed
      const dailyHabits = habits.filter(
        (h) =>
          h.frequency === "Daily" ||
          (h.frequency === "Weekdays" &&
            [1, 2, 3, 4, 5].includes(new Date().getDay())) ||
          (h.frequency === "Weekends" &&
            [0, 6].includes(new Date().getDay())) ||
          (h.frequency === "Weekly" && new Date().getDay() === 1), // Monday
      );

      const allCompleted = dailyHabits.every((h) =>
        updatedCompletedHabits.includes(h.id),
      );

      if (allCompleted && dailyHabits.length > 0) {
        // Award XP for completing all habits
        const totalDifficulty = dailyHabits.reduce(
          (sum, h) => sum + h.difficulty,
          0,
        );
        const xpToAward = totalDifficulty * 10; // 10 XP per difficulty point

        const { error: xpError } = await supabase.from("xp").insert([
          {
            user_id: user.id,
            amount: xpToAward,
            source: "daily_completion",
          },
        ]);

        if (xpError) throw xpError;

        // Update streak
        const { data: streakData, error: streakError } = await supabase.rpc(
          "update_streak",
          { user_id_param: user.id },
        );

        if (streakError) throw streakError;

        // Update local state
        setTotalXP(totalXP + xpToAward);
        setStreak({
          current: streakData.current_streak,
          longest: streakData.longest_streak,
        });

        // Show celebration if streak milestone reached
        if (
          streakData.current_streak > 0 &&
          streakData.current_streak % 5 === 0
        ) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }

        toast({
          title: "All habits completed!",
          description: `You earned ${xpToAward} XP today. Current streak: ${streakData.current_streak} days.`,
        });
      } else {
        toast({
          title: "Habit completed",
          description: `Keep going! ${
            dailyHabits.length -
            updatedCompletedHabits.filter((id) =>
              dailyHabits.some((h) => h.id === id),
            ).length
          } habits left for today.`,
        });
      }
    } catch (error) {
      console.error("Error completing habit:", error);
      toast({
        title: "Error",
        description: "Failed to mark habit as complete. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter habits based on frequency and current day
  const getTodayHabits = () => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
    return habits.filter((habit) => {
      switch (habit.frequency) {
        case "Daily":
          return true;
        case "Weekdays":
          return today >= 1 && today <= 5;
        case "Weekends":
          return today === 0 || today === 6;
        case "Weekly":
          return today === 1; // Monday
        default:
          return false;
      }
    });
  };

  const todayHabits = getTodayHabits();
  const completedCount = todayHabits.filter((h) =>
    completedHabits.includes(h.id),
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="lg" text="Loading your habits..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-8 shadow-xl text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Sparkles className="h-16 w-16 text-yellow-500" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-2">Streak Milestone!</h2>
              <p className="text-xl mb-4">
                You've reached a {streak.current} day streak!
              </p>
              <p className="text-gray-600 mb-6">Keep up the great work!</p>
              <Button onClick={() => setShowCelebration(false)}>
                Continue
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DailyProgress
            completed={completedCount}
            total={todayHabits.length}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StreakCounter
            currentStreak={streak.current}
            longestStreak={streak.longest}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <XPCounter totalXP={totalXP} />
        </motion.div>
      </div>

      {/* Habits and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habits section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Today's Habits</h2>
            <CreateHabitDialog onCreateHabit={handleCreateHabit} />
          </div>

          {todayHabits.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500 mb-4">
                  You don't have any habits for today.
                </p>
                <CreateHabitDialog
                  onCreateHabit={handleCreateHabit}
                  open={false}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {todayHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <HabitCard
                      habit={habit}
                      isCompleted={completedHabits.includes(habit.id)}
                      onComplete={handleCompleteHabit}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Leaderboard and Friends section */}
        <div className="space-y-6">
          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                  Leaderboard
                </span>
                <Tabs
                  value={leaderboardPeriod}
                  onValueChange={(v) =>
                    setLeaderboardPeriod(v as "weekly" | "monthly")
                  }
                  className="w-auto"
                >
                  <TabsList className="grid w-[180px] grid-cols-2">
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardCard
                users={leaderboard}
                title={
                  leaderboardPeriod === "weekly"
                    ? "Weekly Leaders"
                    : "Monthly Leaders"
                }
              />
            </CardContent>
          </Card>

          {/* Friends section */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-500" />
                Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FriendsList />
                <InviteFriend />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
