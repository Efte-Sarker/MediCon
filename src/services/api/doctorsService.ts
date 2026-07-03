import { DoctorProfile } from '../../types/medical.types';

// Extend DoctorProfile for mock usage to include the fields used in DashboardDoctor if needed.
// Wait, the types expect `DashboardDoctor` in some places. I will add experience for UI purposes.
export interface Doctor extends DoctorProfile {
  experience: string;
}

export interface ConsultationHistoryItem {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: 'completed' | 'cancelled' | 'upcoming';
}

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'General Medicine', icon: 'stethoscope' },
  { id: 'cat-2', name: 'Cardiology', icon: 'heart-pulse' },
  { id: 'cat-3', name: 'Pediatrics', icon: 'baby-carriage' },
  { id: 'cat-4', name: 'Neurology', icon: 'brain' },
  { id: 'cat-5', name: 'Dermatology', icon: 'allergy' },
  { id: 'cat-6', name: 'Psychiatry', icon: 'head-lightbulb-outline' },
];

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    userId: 'u-doc-1',
    fullName: 'Dr. Sarah Khan',
    department: 'General Medicine',
    licenseNumber: 'LIC-12345',
    consultationFee: 50,
    isOnline: true,
    rating: 4.8,
    reviewCount: 124,
    about:
      'Dr. Sarah Khan is an experienced general physician with over 15 years of clinical experience in treating a wide range of acute and chronic conditions.',
    experience: '15 years',
  },
  {
    id: 'doc-2',
    userId: 'u-doc-2',
    fullName: 'Dr. Ahmed Rahman',
    department: 'Cardiology',
    licenseNumber: 'LIC-67890',
    consultationFee: 80,
    isOnline: false,
    rating: 4.9,
    reviewCount: 342,
    about:
      'Dr. Ahmed Rahman specializes in cardiovascular diseases, focusing on preventive cardiology and advanced heart failure management.',
    experience: '12 years',
  },
  {
    id: 'doc-3',
    userId: 'u-doc-3',
    fullName: 'Dr. Emily Chen',
    department: 'Pediatrics',
    licenseNumber: 'LIC-11223',
    consultationFee: 60,
    isOnline: true,
    rating: 4.7,
    reviewCount: 89,
    about:
      'Dr. Emily Chen is a compassionate pediatrician dedicated to the health and well-being of children from infancy through adolescence.',
    experience: '8 years',
  },
  {
    id: 'doc-4',
    userId: 'u-doc-4',
    fullName: 'Dr. Michael Roberts',
    department: 'Neurology',
    licenseNumber: 'LIC-44556',
    consultationFee: 100,
    isOnline: true,
    rating: 4.6,
    reviewCount: 210,
    about:
      'Dr. Michael Roberts is a board-certified neurologist with a special interest in movement disorders and neurodegenerative diseases.',
    experience: '20 years',
  },
];

export const doctorsService = {
  /**
   * Retrieves a list of available doctor categories/departments
   */
  getCategories: async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CATEGORIES;
  },

  /**
   * Retrieves a list of doctors, optionally filtered by category
   */
  getDoctors: async (categoryId?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (categoryId) {
      const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
      if (category) {
        return MOCK_DOCTORS.filter((doc) => doc.department === category.name);
      }
    }

    return MOCK_DOCTORS;
  },

  /**
   * Retrieves a single doctor's details by ID
   */
  getDoctorDetails: async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_DOCTORS.find((doc) => doc.id === id) || null;
  },

  /**
   * Retrieves the current user's consultation history.
   * To test the empty state, you can toggle `returnEmpty` to true.
   */
  getConsultationHistory: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const returnEmpty = false; // Toggle this to test the new user empty-history case

    if (returnEmpty) {
      return [];
    }

    const history: ConsultationHistoryItem[] = [
      {
        id: 'cons-1',
        doctorId: 'doc-1',
        doctorName: 'Dr. Sarah Khan',
        specialty: 'General Medicine',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        status: 'completed',
      },
      {
        id: 'cons-2',
        doctorId: 'doc-2',
        doctorName: 'Dr. Ahmed Rahman',
        specialty: 'Cardiology',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        status: 'completed',
      },
    ];

    return history;
  },
};
