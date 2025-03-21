import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, Settings, User, Trophy, Flame } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";

export default function LandingPage() {
  const { user, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-[rgba(255,255,255,0.8)] backdrop-blur-md border-b border-[#f5f5f7]/30">
        <div className="max-w-[980px] mx-auto flex h-12 items-center justify-between px-4">
          <div className="flex items-center">
            <Link
              to="/"
              className="font-bold text-xl text-green-600 flex items-center"
            >
              <Flame className="mr-2 h-6 w-6 text-green-600" />
              HabitXP
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/habits">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Habits
                  </Button>
                </Link>
                <Link to="/leaderboards">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Leaderboards
                  </Button>
                </Link>
                <Link to="/social">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Social
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 hover:cursor-pointer">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm font-light hover:text-gray-500"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-green-500 text-white hover:bg-green-600 text-sm px-4">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="pt-12">
        {/* Hero section */}
        <section className="py-20 text-center">
          <div className="max-w-[980px] mx-auto px-4">
            <h2 className="text-5xl font-semibold tracking-tight mb-1">
              Build <span className="text-green-500">Better Habits</span>, Earn
              XP Every Day
            </h2>
            <h3 className="text-2xl font-medium text-gray-500 mb-6">
              A gamified habit tracking app that makes building habits fun and
              rewarding
            </h3>
            <div className="flex justify-center space-x-6 text-xl text-green-600 mb-8">
              <Link to="/signup" className="flex items-center hover:underline">
                Start your streak <ChevronRight className="h-4 w-4" />
              </Link>
              <a href="#howworks" className="flex items-center hover:underline">
                How it works <ChevronRight className="h-4 w-4" />
              </a>
            </div>

            <div className="relative mt-8 bg-gradient-to-r from-green-100 to-purple-100 p-8 rounded-3xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300 rounded-full -mr-16 -mt-16 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-300 rounded-full -ml-12 -mb-12 opacity-20"></div>

              <div className="relative z-10 grid grid-cols-7 gap-2 mb-6">
                {Array(7)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className={`h-16 rounded-xl flex items-center justify-center ${i < 5 ? "bg-green-500 text-white" : "bg-white border-2 border-dashed border-gray-300"}`}
                    >
                      {i < 5 && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  ))}
              </div>

              <div className="relative z-10 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Morning Meditation</h4>
                    <p className="text-sm text-gray-500">10 minutes daily</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Completed
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium">Language Practice</h4>
                    <p className="text-sm text-gray-500">15 minutes daily</p>
                  </div>
                </div>
                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Pending
                </div>
              </div>

              <div className="relative z-10 mt-6 flex justify-between items-center">
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Current Streak</span>
                  <div className="text-2xl font-bold text-green-600">
                    5 Days
                  </div>
                </div>

                <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                  <span className="text-sm text-gray-500">Total XP</span>
                  <div className="text-2xl font-bold text-purple-600">
                    350 XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="py-20 bg-[#f5f5f7] text-center" id="howworks">
          <div className="max-w-[980px] mx-auto px-4">
            <h2 className="text-5xl font-semibold tracking-tight mb-1">
              How It Works
            </h2>
            <h3 className="text-2xl font-medium text-gray-500 mb-8">
              Simple, fun, and effective habit building
            </h3>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-100 w-24 h-24 rounded-full -mr-12 -mt-12"></div>
                <div className="relative z-10">
                  <div className="h-14 w-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">
                    Create Your Habits
                  </h4>
                  <p className="text-gray-500">
                    Set up daily habits with customizable frequency, difficulty,
                    and reminders.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-100 w-24 h-24 rounded-full -mr-12 -mt-12"></div>
                <div className="relative z-10">
                  <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">Track Completion</h4>
                  <p className="text-gray-500">
                    Mark habits as complete and watch your streak grow day by
                    day.
                  </p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-100 w-24 h-24 rounded-full -mr-12 -mt-12"></div>
                <div className="relative z-10">
                  <div className="h-14 w-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-medium mb-2">
                    Earn XP & Rewards
                  </h4>
                  <p className="text-gray-500">
                    Complete all daily habits to earn XP and climb the
                    leaderboards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grid section for other features */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-[980px] mx-auto">
          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              Leaderboards
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Compete with friends
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-600 mb-6">
              <Link to="/signup" className="flex items-center hover:underline">
                Join the competition <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-white p-6 rounded-xl max-w-sm mx-auto shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      1
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                          alt="Alex"
                        />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Alex</span>
                    </div>
                  </div>
                  <span className="font-bold">750 XP</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      2
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor"
                          alt="Taylor"
                        />
                        <AvatarFallback>T</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Taylor</span>
                    </div>
                  </div>
                  <span className="font-bold">680 XP</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      3
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan"
                          alt="Jordan"
                        />
                        <AvatarFallback>J</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Jordan</span>
                    </div>
                  </div>
                  <span className="font-bold">520 XP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#f5f5f7] rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-semibold tracking-tight mb-1">
              XP Milestones
            </h2>
            <h3 className="text-xl font-medium text-gray-500 mb-4">
              Celebrate your progress
            </h3>
            <div className="flex justify-center space-x-6 text-lg text-green-600 mb-6">
              <Link to="/signup" className="flex items-center hover:underline">
                Start your journey <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-4 bg-white p-6 rounded-xl shadow-sm max-w-sm mx-auto">
              <div className="space-y-6">
                <div className="relative">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <div className="absolute -top-2 left-[70%] w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                  <div className="mt-4 flex justify-between text-sm">
                    <span>0 days</span>
                    <span className="font-medium text-green-600">7 days</span>
                    <span>10 days</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">7 Days</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-center opacity-60">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">30 Days</span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg text-center opacity-60">
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span className="text-xs font-medium">100 Days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 text-center bg-gradient-to-r from-green-500 to-purple-600 text-white">
          <div className="max-w-[980px] mx-auto px-4">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Build Better Habits?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of users who are transforming their daily routines
              and achieving their goals.
            </p>
            <Link to="/signup">
              <Button className="rounded-full bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-medium">
                Start Your Streak Today
              </Button>
            </Link>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-[#f5f5f7] py-12 text-xs text-gray-500">
        <div className="max-w-[980px] mx-auto px-4">
          <div className="border-b border-gray-300 pb-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                HabitXP
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Habit Building Guide
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">
                Community
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Leaderboards
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Challenges
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Groups
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="py-4">
            <p>Copyright © 2025 HabitXP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
