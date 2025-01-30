"use client";

import { MoonIcon, SunIcon, LayoutDashboard, Calendar } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center space-x-2">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">TaskFlow</span>
        </div>
        <nav className="ml-8 flex space-x-4">
          <Link href="/">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center space-x-2",
                pathname === "/" && "bg-secondary"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Board</span>
            </Button>
          </Link>
          <Link href="/schedule">
            <Button
              variant="ghost"
              className={cn(
                "flex items-center space-x-2",
                pathname === "/schedule" && "bg-secondary"
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </Button>
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
