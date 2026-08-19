import { create } from 'zustand';
import { DashboardAppointment } from '../hooks/usePatientDashboard';
import { ImageSourcePropType } from 'react-native';

export interface PatientStore {
  nextAppointment: DashboardAppointment | null;
  setNextAppointment: (appointment: DashboardAppointment | null) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  nextAppointment: {
    id: 'appt-001',
    doctorName: 'Dr. Tariqur Rahman',
    specialty: 'General Medicine',
    dateTime: '2026-07-05T10:30:00',
    format: 'video',
    imageUrl: '', // We will use require in the hook to avoid circular logic
  },
  setNextAppointment: (appointment) => set({ nextAppointment: appointment }),
}));
