// 1. IMPORTS
import { useMemo } from 'react';

// 2. TYPES
export interface DashboardAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  dateTime: string;
  format: 'video' | 'in-person';
  imageUrl?: string;
}

export interface DashboardDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
}

export interface DashboardMedication {
  id: string;
  name: string;
  instructions: string;
  scheduleFormat: string;
  scheduledTime: string;
  status: 'upcoming' | 'taken' | 'missed';
}

export interface PatientDashboardData {
  nextAppointment: DashboardAppointment | null;
  recentDoctor: DashboardDoctor | null;
  nextMedicine: DashboardMedication | null;
}

// 3. HOOK
/**
 * Provides mock data for the Patient Dashboard.
 * In a future milestone, this will be backed by real API calls / local DB queries.
 * Returns null values for a brand-new patient with no data (empty state).
 */
export const usePatientDashboard = (): PatientDashboardData => {
  const data = useMemo<PatientDashboardData>(
    () => ({
      nextAppointment: {
        id: 'appt-001',
        doctorName: 'Dr. Sarah Khan',
        specialty: 'General Medicine',
        dateTime: '2026-07-05T10:30:00',
        format: 'video',
        imageUrl: 'https://i.pravatar.cc/150?img=32',
      },
      recentDoctor: {
        id: 'doc-001',
        name: 'Dr. Ahmed Rahman',
        specialty: 'Cardiology',
        rating: 4.8,
        experience: '12 years',
      },
      nextMedicine: {
        id: 'med-001',
        name: 'Amoxicillin',
        instructions: 'After meals',
        scheduleFormat: '1+0+1',
        scheduledTime: '08:00 PM',
        status: 'upcoming',
      },
    }),
    [],
  );

  return data;
};
