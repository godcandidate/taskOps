import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { UserProfile, UserRole } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Role-based navigation and access control
export function canAccessRoute(user: UserProfile | null, requiredRole: UserRole | 'any'): boolean {
  if (!user) return false;
  if (requiredRole === 'any') return true;
  return user.role === requiredRole || user.role === 'admin'; // Admins can access all routes
}

export function getDashboardPath(role: UserRole): string {
  return '/dashboard';
}

export function formatUserName(user: UserProfile | null): string {
  if (!user) return 'User';
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  return user.email;
}
