import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, LogOut, BookOpen } from "lucide-react";
import { AuthDialog } from "./AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  user: { email: string; name: string } | null;
  onLogin: (email: string, password: string, name?: string) => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ user, onLogin, onLogout, searchQuery, onSearchChange }: HeaderProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <header className="border-b sticky top-0 bg-white z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">CourseReview</h1>
          </div>

          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses or professors..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowAuthDialog(true)}>Sign In</Button>
            )}
          </div>
        </div>
      </div>

      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onLogin={onLogin}
      />
    </header>
  );
}
