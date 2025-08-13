'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, User, LogOut, CheckSquare } from 'lucide-react';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2 py-2">
            <div className="rounded-md bg-purple-gradient p-1.5 shadow-sm">
              <CheckSquare className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">TaskMaster</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <nav className="flex items-center gap-6">
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover-purple ${
                  pathname === '/dashboard' ? 'active-purple' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/profile" 
                className={`text-sm font-medium transition-colors hover-purple ${
                  pathname === '/profile' ? 'active-purple' : 'text-muted-foreground'
                }`}
              >
                Profile
              </Link>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sm font-medium text-muted-foreground hover-purple flex items-center gap-1.5 px-3"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </nav>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container py-4 md:hidden border-t border-border/40 bg-background/95">
          <nav className="flex flex-col gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium transition-colors hover-purple ${
                    pathname === '/dashboard' ? 'active-purple' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  className={`text-sm font-medium transition-colors hover-purple ${
                    pathname === '/profile' ? 'active-purple' : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start px-0 text-sm font-medium text-muted-foreground hover-purple flex items-center gap-1.5" 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-medium text-muted-foreground hover-purple"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="text-sm font-medium text-muted-foreground hover-purple"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
