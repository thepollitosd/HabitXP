import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Trophy, Flame, Users } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 text-black">
      {/* Gamified navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.9)] backdrop-blur-md border-b border-green-100">
        <div className="max-w-[980px] mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-bold text-xl text-green-600 flex items-center"
            >
              <Flame className="mr-2 h-6 w-6 text-green-600" />
              HabitXP
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium">
            <Link to="/" className="hover:text-green-600 flex items-center">
              <Flame className="mr-1 h-4 w-4" /> Habits
            </Link>
            <Link to="/" className="hover:text-green-600 flex items-center">
              <Trophy className="mr-1 h-4 w-4" /> Leaderboards
            </Link>
            <Link to="/" className="hover:text-green-600 flex items-center">
              <Users className="mr-1 h-4 w-4" /> Friends
            </Link>
          </nav>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center pt-14">
        <div className="max-w-md w-full px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-green-600">
              HabitXP
            </h2>
            <p className="text-xl font-medium text-gray-600 mt-2">
              Sign in to track your habits and earn XP
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
