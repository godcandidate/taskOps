'use client';

import { UserProfileForm } from '@/components/user-profile';
import ProtectedRoute from '@/components/protected-route';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="container max-w-3xl mx-auto py-10 px-4">
        <UserProfileForm />
      </div>
    </ProtectedRoute>
  );
}
