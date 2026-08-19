import Constants from 'expo-constants';
import { DoctorProfile } from '../../types/medical.types';
import {
  doctorPlaceholders,
  maleDoctorPlaceholders,
  femaleDoctorPlaceholders,
} from '../../constants/images';

export interface DoctorExperienceEntry {
  id: string;
  hospitalName: string;
  designation: string;
  department: string;
  status: 'present' | 'past';
  period: string;
}

export interface Doctor extends DoctorProfile {
  experience: string;
  degrees: string[];
  bmdcNumber: string;
  followUpFee: number;
  followUpDays: number;
  workingHospital: string;
  workingHospitalId: string;
  totalPatients: number;
  avgConsultationMinutes: number;
  services: string[];
  experienceList: DoctorExperienceEntry[];
  image?: ReturnType<(typeof doctorPlaceholders)[number]>;
}

export interface ConsultationHistoryItem {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  image?: ReturnType<(typeof doctorPlaceholders)[number]>;
}

export const DEMO_MOCK_DOCTORS: Doctor[] = [
  {
    id: 'demo_doc_1',
    userId: 'usr_demo_1',
    fullName: 'Dr. Tariqur Rahman',
    department: 'General Medicine',
    gender: 'Male',
    experience: '15 Years',
    rating: 4.8,
    reviewCount: 450,
    totalPatients: 8000,
    consultationFee: 1000,
    followUpFee: 600,
    followUpDays: 14,
    workingHospital: 'Square Hospital Ltd.',
    workingHospitalId: 'hosp_001',
    avgConsultationMinutes: 20,
    bmdcNumber: 'A-12345',
    degrees: ['MBBS', 'FCPS (Medicine)'],
    services: ['Fever', 'Cold', 'General Illness'],
    experienceList: [],
    isOnline: true,
    phoneNumber: '+8801711223344',
    dateOfBirth: '1980-01-01',
    about: 'Senior Consultant in Internal Medicine.',
    licenseNumber: 'BD-MED-101',
    medicalCollege: 'Dhaka Medical College',
    languagesSpoken: ['Bengali', 'English'],
  },
  {
    id: 'demo_doc_2',
    userId: 'usr_demo_2',
    fullName: 'Dr. Nusrat Jahan',
    department: 'General Medicine',
    gender: 'Female',
    experience: '8 Years',
    rating: 4.5,
    reviewCount: 230,
    totalPatients: 4500,
    consultationFee: 800,
    followUpFee: 500,
    followUpDays: 14,
    workingHospital: 'Labaid Specialized Hospital',
    workingHospitalId: 'hosp_003',
    avgConsultationMinutes: 15,
    bmdcNumber: 'A-23456',
    degrees: ['MBBS', 'MD (Internal Medicine)'],
    services: ['Fever', 'Cold', 'General Illness'],
    experienceList: [],
    isOnline: false,
    phoneNumber: '+8801711223355',
    dateOfBirth: '1988-05-15',
    about: 'Specialist in General Medicine.',
    licenseNumber: 'BD-MED-102',
    medicalCollege: 'Sir Salimullah Medical College',
    languagesSpoken: ['Bengali', 'English'],
  },
  {
    id: 'demo_doc_3',
    userId: 'usr_demo_3',
    fullName: 'Dr. Ahmed Hasan',
    department: 'General Medicine',
    gender: 'Male',
    experience: '12 Years',
    rating: 4.7,
    reviewCount: 340,
    totalPatients: 6000,
    consultationFee: 900,
    followUpFee: 500,
    followUpDays: 14,
    workingHospital: 'Evercare Hospital',
    workingHospitalId: 'hosp_004',
    avgConsultationMinutes: 20,
    bmdcNumber: 'A-34567',
    degrees: ['MBBS', 'MRCP (UK)'],
    services: ['Fever', 'Cold', 'Internal Medicine'],
    experienceList: [],
    isOnline: true,
    phoneNumber: '+8801711223366',
    dateOfBirth: '1982-10-20',
    about: 'Experienced in diagnosing complex medical conditions.',
    licenseNumber: 'BD-MED-103',
    medicalCollege: 'Chittagong Medical College',
    languagesSpoken: ['Bengali', 'English'],
  },
  {
    id: 'demo_doc_4',
    userId: 'usr_demo_4',
    fullName: 'Dr. Farhana Akter',
    department: 'General Medicine',
    gender: 'Female',
    experience: '5 Years',
    rating: 4.2,
    reviewCount: 120,
    totalPatients: 1500,
    consultationFee: 600,
    followUpFee: 400,
    followUpDays: 7,
    workingHospital: 'Popular Diagnostic Centre',
    workingHospitalId: 'hosp_005',
    avgConsultationMinutes: 15,
    bmdcNumber: 'A-45678',
    degrees: ['MBBS'],
    services: ['Fever', 'Cold', 'Primary Care'],
    experienceList: [],
    isOnline: true,
    phoneNumber: '+8801711223377',
    dateOfBirth: '1992-03-10',
    about: 'Dedicated to providing primary care to patients.',
    licenseNumber: 'BD-MED-104',
    medicalCollege: 'Sylhet MAG Osmani Medical College',
    languagesSpoken: ['Bengali', 'English'],
  },
];

const MOCK_CATEGORIES = [
  { id: 'cat-1', name: 'General Medicine', icon: 'stethoscope', keyword: 'Fever, Cold' },
  { id: 'cat-2', name: 'Cardiology', icon: 'heart-pulse', keyword: 'Heart Specialist' },
  { id: 'cat-3', name: 'Pediatrics', icon: 'baby-carriage', keyword: 'Child Specialist' },
  { id: 'cat-4', name: 'Neurology', icon: 'brain', keyword: 'Brain Specialist' },
  { id: 'cat-5', name: 'Dermatology', icon: 'allergy', keyword: 'Skin Specialist' },
  { id: 'cat-6', name: 'Psychiatry', icon: 'head-lightbulb-outline', keyword: 'Mental Health' },
  { id: 'cat-7', name: 'Orthopedics', icon: 'bone', keyword: 'Bone Specialist' },
  { id: 'cat-8', name: 'Ophthalmology', icon: 'eye', keyword: 'Eye Specialist' },
  { id: 'cat-9', name: 'Dentistry', icon: 'tooth', keyword: 'Dental Care' },
  { id: 'cat-10', name: 'ENT', icon: 'ear-hearing', keyword: 'Ear, Nose, Throat' },
  { id: 'cat-11', name: 'Gynecology', icon: 'gender-female', keyword: "Women's Health" },
  { id: 'cat-12', name: 'Urology', icon: 'water', keyword: 'Kidney Specialist' },
];

const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_BASE_URL = `http://${localhost}:8000/api/v1`;

export const doctorsService = {
  getCategories: async () => {
    return MOCK_CATEGORIES;
  },

  getDoctors: async (categoryId?: string): Promise<Doctor[]> => {
    // Return mock doctors directly for the 'General Medicine' category
    if (categoryId) {
      const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
      if (category && category.name === 'General Medicine') {
        let mockDocs = [...DEMO_MOCK_DOCTORS];
        mockDocs.sort((a, b) => b.rating - a.rating); // Sort by rating
        return mockDocs.map((doc, index) => {
          const isFemale = doc.gender?.toLowerCase() === 'female';
          const placeholders = isFemale ? femaleDoctorPlaceholders : maleDoctorPlaceholders;
          return {
            ...doc,
            image: placeholders[index % placeholders.length],
          };
        });
      }
    }

    let url = `${API_BASE_URL}/doctors/`;
    if (categoryId) {
      const category = MOCK_CATEGORIES.find((c) => c.id === categoryId);
      if (category) url += `?category_id=${encodeURIComponent(category.name)}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch doctors');
    const doctors: Doctor[] = await response.json();
    // Assign local images for UI continuity
    return doctors.map((doc, index) => {
      const isFemale = doc.gender?.toLowerCase() === 'female';
      const placeholders = isFemale ? femaleDoctorPlaceholders : maleDoctorPlaceholders;
      return {
        ...doc,
        image: placeholders[index % placeholders.length],
      };
    });
  },

  getDoctorDetails: async (id: string): Promise<Doctor | null> => {
    // Check mock doctors first for the demo
    const mockDoc = DEMO_MOCK_DOCTORS.find((doc) => doc.id === id);
    if (mockDoc) {
      const isFemale = mockDoc.gender?.toLowerCase() === 'female';
      const placeholders = isFemale ? femaleDoctorPlaceholders : maleDoctorPlaceholders;
      const index = DEMO_MOCK_DOCTORS.findIndex((d) => d.id === id);
      return {
        ...mockDoc,
        image: placeholders[index % placeholders.length],
      };
    }

    const doctors = await doctorsService.getDoctors();
    return doctors.find((doc) => doc.id === id) ?? null;
  },

  getConsultationHistory: async (): Promise<ConsultationHistoryItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // We keep this mock since consultation backend isn't fully set up for the current user
    const baseHistory: ConsultationHistoryItem[] = [
      {
        id: 'cons_101',
        doctorId: 'doc_101',
        doctorName: 'Dr. Ahmed Hasan',
        specialty: 'Cardiology',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        image: maleDoctorPlaceholders[0],
      },
      {
        id: 'cons_102',
        doctorId: 'doc_102',
        doctorName: 'Dr. Nusrat Jahan',
        specialty: 'Gynecology',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        image: femaleDoctorPlaceholders[0],
      },
      {
        id: 'cons_103',
        doctorId: 'doc_103',
        doctorName: 'Dr. Tariqur Rahman',
        specialty: 'Neurology',
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        image: maleDoctorPlaceholders[1],
      },
    ];

    return baseHistory;
  },
};
