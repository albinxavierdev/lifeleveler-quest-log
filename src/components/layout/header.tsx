
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { LevelBadge } from "@/components/ui/level-badge";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  CheckSquare, 
  Target, 
  Briefcase, 
  ShoppingBag,
  User,
  LogOut,
  Shield
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { stats } = useAppContext();
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/quests", label: "Quests", icon: CheckSquare },
    { path: "/missions", label: "Missions", icon: Target },
    { path: "/side-hustle", label: "Side Hustle", icon: Briefcase },
    { path: "/rewards", label: "Rewards", icon: ShoppingBag },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <LevelBadge level={stats.level} />
            <span className="font-bold">Impulze</span>
          </Link>
        </div>
        
        <nav className="flex-1 md:flex md:justify-center">
          <ul className="hidden items-center justify-center gap-6 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="flex items-center justify-end space-x-4">
          <div className="hidden items-center space-x-1 md:flex">
            <span className="font-medium">{stats.xp}</span>
            <span className="text-xs text-muted-foreground">XP</span>
          </div>
          <div className="hidden items-center space-x-1 md:flex">
            <span className="font-medium">{stats.gold}</span>
            <span className="text-xs text-muted-foreground">Gold</span>
          </div>
          
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user.email?.split('@')[0] || 'User'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex w-full cursor-pointer items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background md:hidden">
        <ul className="container flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  className={`flex flex-col items-center py-2 text-[10px] font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="mb-1 h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
