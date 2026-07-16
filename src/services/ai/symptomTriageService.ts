import { Doctor } from '../api/doctorsService';

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'd1',
    userId: 'u1',
    fullName: 'Dr. Sarah Ahmed',
    department: 'Cardiology',
    licenseNumber: 'BMDC-12345',
    consultationFee: 1000,
    followUpFee: 600,
    followUpDays: 14,
    isOnline: true,
    rating: 4.9,
    reviewCount: 128,
    about: 'Specialist in heart diseases and cardiovascular health.',
    experience: '12 years',
    degrees: ['MBBS', 'FCPS (Cardiology)'],
    bmdcNumber: 'BMDC-A-12345',
    workingHospital: 'National Heart Foundation Hospital',
    totalPatients: 320,
    avgConsultationMinutes: 20,
    services: ['Chest Pain', 'Hypertension', 'Heart Failure'],
    experienceList: [
      {
        id: 'exp-d1-1',
        hospitalName: 'National Heart Foundation Hospital',
        designation: 'Consultant Cardiologist',
        department: 'Cardiology',
        status: 'present',
        period: '2018 – Present',
      },
    ],
  },
  {
    id: 'd2',
    userId: 'u2',
    fullName: 'Dr. Rafiqul Islam',
    department: 'Dermatology',
    licenseNumber: 'BMDC-67890',
    consultationFee: 800,
    followUpFee: 450,
    followUpDays: 14,
    isOnline: true,
    rating: 4.7,
    reviewCount: 95,
    about: 'Expert in skin conditions, allergies, and cosmetic dermatology.',
    experience: '8 years',
    degrees: ['MBBS', 'FCPS (Dermatology)'],
    bmdcNumber: 'BMDC-A-67890',
    workingHospital: 'Dhaka Medical College Hospital',
    totalPatients: 210,
    avgConsultationMinutes: 15,
    services: ['Acne', 'Eczema', 'Psoriasis', 'Skin Allergy'],
    experienceList: [
      {
        id: 'exp-d2-1',
        hospitalName: 'Dhaka Medical College Hospital',
        designation: 'Consultant Dermatologist',
        department: 'Dermatology',
        status: 'present',
        period: '2020 – Present',
      },
    ],
  },
  {
    id: 'd3',
    userId: 'u3',
    fullName: 'Dr. Nusrat Jahan',
    department: 'General Practice',
    licenseNumber: 'BMDC-11223',
    consultationFee: 500,
    followUpFee: 300,
    followUpDays: 7,
    isOnline: false,
    rating: 4.8,
    reviewCount: 210,
    about: 'Experienced general physician for routine checkups and common illnesses.',
    experience: '15 years',
    degrees: ['MBBS', 'MD (Internal Medicine)'],
    bmdcNumber: 'BMDC-A-11223',
    workingHospital: 'Popular Medical Centre',
    totalPatients: 415,
    avgConsultationMinutes: 18,
    services: ['Fever', 'Cold & Cough', 'Diabetes', 'Hypertension'],
    experienceList: [
      {
        id: 'exp-d3-1',
        hospitalName: 'Popular Medical Centre',
        designation: 'Consultant Physician',
        department: 'General Medicine',
        status: 'present',
        period: '2015 – Present',
      },
    ],
  },
  {
    id: 'd4',
    userId: 'u4',
    fullName: 'Dr. Kamal Hossain',
    department: 'Neurology',
    licenseNumber: 'BMDC-44556',
    consultationFee: 1200,
    followUpFee: 700,
    followUpDays: 30,
    isOnline: true,
    rating: 4.6,
    reviewCount: 75,
    about: 'Focuses on nervous system disorders and chronic headaches.',
    experience: '10 years',
    degrees: ['MBBS', 'MD (Neurology)'],
    bmdcNumber: 'BMDC-A-44556',
    workingHospital: 'National Institute of Neurosciences',
    totalPatients: 185,
    avgConsultationMinutes: 25,
    services: ['Migraine', 'Epilepsy', 'Neuropathy', 'Dizziness'],
    experienceList: [
      {
        id: 'exp-d4-1',
        hospitalName: 'National Institute of Neurosciences',
        designation: 'Consultant Neurologist',
        department: 'Neurology',
        status: 'present',
        period: '2019 – Present',
      },
    ],
  },
];

class SymptomTriageService {
  /**
   * Mocks an AI recommendation engine that parses a symptom query
   * and returns a dynamically ranked list of relevant doctors.
   */
  async searchDoctorsBySymptom(query: string): Promise<Doctor[]> {
    // Simulate network delay for AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowerQuery = query.toLowerCase();
    let recommended: Doctor[] = [];

    // Simple keyword matching mock logic
    if (lowerQuery.includes('heart') || lowerQuery.includes('chest')) {
      recommended = MOCK_DOCTORS.filter((d) => d.department === 'Cardiology');
    } else if (lowerQuery.includes('skin') || lowerQuery.includes('rash')) {
      recommended = MOCK_DOCTORS.filter((d) => d.department === 'Dermatology');
    } else if (lowerQuery.includes('headache') || lowerQuery.includes('dizzy')) {
      recommended = MOCK_DOCTORS.filter((d) => d.department === 'Neurology');
    } else {
      // Default to general practice for unmatched or generic symptoms (fever, cold, etc.)
      recommended = MOCK_DOCTORS.filter((d) => d.department === 'General Practice');
    }

    // Always append general practice as a fallback if not already included
    if (!recommended.some((d) => d.department === 'General Practice')) {
      const gp = MOCK_DOCTORS.find((d) => d.department === 'General Practice');
      if (gp) {
        recommended.push(gp);
      }
    }

    return recommended;
  }
}

export const symptomTriageService = new SymptomTriageService();
