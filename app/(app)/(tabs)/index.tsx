import React from 'react';
import { useAuthStore } from '../../../src/store/authStore';
import { PatientDashboard } from '../../../src/components/dashboard/PatientDashboard';
import { PlaceholderScreen } from '../../../src/components/navigation/PlaceholderScreen';

export default function HomeScreen() {
  const role = useAuthStore((s) => s.role);

  if (role === 'doctor') {
    return (
      <PlaceholderScreen
        title="Doctor Home"
        description="Doctor dashboard will be built in Milestone 1.12."
      />
    );
  }

  // Default to patient dashboard (also covers null role gracefully)
  return <PatientDashboard />;
}
