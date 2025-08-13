'use client';

import { useAuth } from '@/lib/auth-context';
import ProtectedRoute from '@/components/protected-route';
import { AdminDashboard } from '@/components/admin-dashboard';
import { UserDashboard } from '@/components/user-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Welcome, {user?.firstName || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin' 
              ? 'Manage all tasks and assign them to users' 
              : 'View and update your assigned tasks'}
          </p>
        </div>
        

        
        {user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />}
      </div>
    </ProtectedRoute>
  );
}
