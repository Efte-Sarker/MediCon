import { DoctorProfile } from '../../types/medical.types';
import { doctorPlaceholders } from '../../constants/images';

// ── Experience entry for the Experience tab ───────────────────────────────────
export interface DoctorExperienceEntry {
  id: string;
  hospitalName: string;
  designation: string;
  department: string;
  /** 'present' for current role, 'past' for a previous role */
  status: 'present' | 'past';
  /** e.g. "2018 – Present" or "2012 – 2018" */
  period: string;
}

// ── Full Doctor model used by the UI ─────────────────────────────────────────
export interface Doctor extends DoctorProfile {
  /** e.g. "15 years" — kept for backward compatibility with existing cards */
  experience: string;
  /** e.g. ["MBBS", "FCPS (Medicine)"] */
  degrees: string[];
  /** Bangladesh Medical & Dental Council registration number */
  bmdcNumber: string;
  /** Follow-up consultation fee in BDT */
  followUpFee: number;
  /** Follow-up validity window in days, e.g. 7 → "Within 7 Days" */
  followUpDays: number;
  /** Current primary workplace */
  workingHospital: string;
  /**
   * Total patients consulted through MediCon app only.
   * Phase 2: replace with real server value.
   */
  totalPatients: number;
  /** Average consultation duration in minutes */
  avgConsultationMinutes: number;
  /** Medical conditions / services offered (for the Services tab) */
  services: string[];
  /** Professional experience history (for the Experience tab) */
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

const BASE_MOCK_DOCTORS: Omit<Doctor, 'image'>[] = [
  {
    id: 'doc-1',
    userId: 'u-doc-1',
    fullName: 'Dr. Sarah Khan',
    department: 'General Medicine',
    licenseNumber: 'LIC-12345',
    consultationFee: 700,
    followUpFee: 400,
    followUpDays: 7,
    isOnline: true,
    rating: 4.8,
    reviewCount: 124,
    about:
      'Dr. Sarah Khan is a highly experienced general physician committed to delivering patient-centred care. With over 15 years of clinical practice, she excels in managing acute illnesses, chronic diseases, and preventive health. She listens carefully, explains clearly, and ensures her patients leave with full confidence in their treatment plan.',
    experience: '15 years',
    degrees: ['MBBS', 'MD (Internal Medicine)'],
    bmdcNumber: '35621',
    workingHospital: 'Dhaka Medical College Hospital',
    totalPatients: 312,
    avgConsultationMinutes: 18,
    services: [
      'Fever & Viral Infections',
      'Cough & Respiratory Issues',
      'Diabetes Management',
      'Hypertension',
      'Thyroid Disorders',
      'Anemia',
      'Digestive Problems',
      'Allergy & Asthma',
      'Fatigue & General Weakness',
      'Preventive Health Check-up',
    ],
    experienceList: [
      {
        id: 'exp-1-1',
        hospitalName: 'Dhaka Medical College Hospital',
        designation: 'Associate Professor & Consultant',
        department: 'General Medicine',
        status: 'present',
        period: '2019 – Present',
      },
      {
        id: 'exp-1-2',
        hospitalName: 'National Institute of Preventive and Social Medicine',
        designation: 'Senior Medical Officer',
        department: 'General Medicine',
        status: 'past',
        period: '2014 – 2019',
      },
      {
        id: 'exp-1-3',
        hospitalName: 'Sylhet MAG Osmani Medical College Hospital',
        designation: 'Medical Officer',
        department: 'General Medicine',
        status: 'past',
        period: '2010 – 2014',
      },
    ],
  },
  {
    id: 'doc-2',
    userId: 'u-doc-2',
    fullName: 'Dr. Ahmed Rahman',
    department: 'Cardiology',
    licenseNumber: 'LIC-67890',
    consultationFee: 1200,
    followUpFee: 700,
    followUpDays: 14,
    isOnline: false,
    rating: 4.9,
    reviewCount: 342,
    about:
      'Dr. Ahmed Rahman is a leading interventional cardiologist with extensive expertise in coronary artery disease, heart failure, and arrhythmia management. He has performed over 2,000 cardiac catheterisation procedures and is a recognised authority in preventive cardiology in Bangladesh.',
    experience: '12 years',
    degrees: ['MBBS', 'FCPS (Cardiology)', 'MD (Cardiology)'],
    bmdcNumber: '48830',
    workingHospital: 'National Heart Foundation Hospital & Research Institute',
    totalPatients: 489,
    avgConsultationMinutes: 22,
    services: [
      'Chest Pain Evaluation',
      'Coronary Artery Disease',
      'Heart Failure Management',
      'Arrhythmia & Palpitations',
      'Hypertension',
      'Echocardiography Interpretation',
      'Post-Cardiac Surgery Follow-up',
      'Dyslipidaemia',
      'Preventive Cardiology',
      'Peripheral Vascular Disease',
    ],
    experienceList: [
      {
        id: 'exp-2-1',
        hospitalName: 'National Heart Foundation Hospital & Research Institute',
        designation: 'Consultant Cardiologist',
        department: 'Interventional Cardiology',
        status: 'present',
        period: '2020 – Present',
      },
      {
        id: 'exp-2-2',
        hospitalName: 'Bangabandhu Sheikh Mujib Medical University',
        designation: 'Associate Professor',
        department: 'Cardiology',
        status: 'past',
        period: '2015 – 2020',
      },
      {
        id: 'exp-2-3',
        hospitalName: 'Chittagong Medical College Hospital',
        designation: 'Senior Registrar',
        department: 'Cardiology',
        status: 'past',
        period: '2012 – 2015',
      },
    ],
  },
  {
    id: 'doc-3',
    userId: 'u-doc-3',
    fullName: 'Dr. Emily Chen',
    department: 'Pediatrics',
    licenseNumber: 'LIC-11223',
    consultationFee: 800,
    followUpFee: 450,
    followUpDays: 7,
    isOnline: true,
    rating: 4.7,
    reviewCount: 89,
    about:
      "Dr. Emily Chen is a compassionate paediatrician dedicated to the health and wellbeing of children from infancy through adolescence. She takes a gentle, family-centred approach and ensures parents are well informed about their child's condition and treatment plan.",
    experience: '8 years',
    degrees: ['MBBS', 'DCH', 'FCPS (Paediatrics)'],
    bmdcNumber: '62214',
    workingHospital: 'Dhaka Shishu Hospital',
    totalPatients: 218,
    avgConsultationMinutes: 20,
    services: [
      'Newborn Care',
      'Growth & Development Assessment',
      'Childhood Fever & Infections',
      'Asthma in Children',
      'Childhood Diarrhoea & Vomiting',
      'Nutritional Deficiencies',
      'Autism Spectrum (Screening)',
      'Childhood Vaccinations',
      'Allergic Disorders',
      'ADHD (Initial Assessment)',
    ],
    experienceList: [
      {
        id: 'exp-3-1',
        hospitalName: 'Dhaka Shishu Hospital',
        designation: 'Consultant Paediatrician',
        department: 'General Paediatrics',
        status: 'present',
        period: '2021 – Present',
      },
      {
        id: 'exp-3-2',
        hospitalName: 'Bangladesh Institute of Child Health',
        designation: 'Medical Officer',
        department: 'Paediatrics',
        status: 'past',
        period: '2016 – 2021',
      },
    ],
  },
  {
    id: 'doc-4',
    userId: 'u-doc-4',
    fullName: 'Dr. Michael Roberts',
    department: 'Neurology',
    licenseNumber: 'LIC-44556',
    consultationFee: 1500,
    followUpFee: 900,
    followUpDays: 30,
    isOnline: true,
    rating: 4.6,
    reviewCount: 210,
    about:
      'Dr. Michael Roberts is a board-certified neurologist with a distinguished career spanning two decades. He holds special expertise in movement disorders, epilepsy management, and neurodegenerative diseases. His meticulous diagnostic approach and clear communication style have earned him exceptional trust from patients and referring physicians alike.',
    experience: '20 years',
    degrees: ['MBBS', 'MD (Neurology)', 'MRCP (UK)'],
    bmdcNumber: '21987',
    workingHospital: 'National Institute of Neurosciences & Hospital',
    totalPatients: 574,
    avgConsultationMinutes: 25,
    services: [
      'Epilepsy & Seizure Disorders',
      "Parkinson's Disease",
      'Migraine & Headache',
      'Stroke Management & Rehabilitation',
      'Multiple Sclerosis',
      'Neuropathy',
      'Dementia & Memory Loss',
      'Tremors & Movement Disorders',
      'Dizziness & Balance Problems',
      'Brain & Spine Imaging Review',
    ],
    experienceList: [
      {
        id: 'exp-4-1',
        hospitalName: 'National Institute of Neurosciences & Hospital',
        designation: 'Professor & Head of Department',
        department: 'Neurology',
        status: 'present',
        period: '2016 – Present',
      },
      {
        id: 'exp-4-2',
        hospitalName: 'Bangabandhu Sheikh Mujib Medical University',
        designation: 'Associate Professor',
        department: 'Neurology',
        status: 'past',
        period: '2010 – 2016',
      },
      {
        id: 'exp-4-3',
        hospitalName: 'University College London Hospitals NHS Foundation Trust',
        designation: 'Clinical Fellow',
        department: 'Neurology',
        status: 'past',
        period: '2007 – 2009',
      },
    ],
  },
  {
    id: 'doc-5',
    userId: 'u-doc-5',
    fullName: 'Dr. John Smith',
    department: 'Orthopedics',
    licenseNumber: 'LIC-77889',
    consultationFee: 1000,
    followUpFee: 600,
    followUpDays: 14,
    isOnline: true,
    rating: 4.8,
    reviewCount: 156,
    about:
      'Dr. John Smith is an accomplished orthopaedic surgeon specialising in sports injuries, arthroscopic procedures, and complex joint replacements. He combines cutting-edge surgical technique with a strong commitment to rehabilitation, ensuring patients regain full function as quickly and safely as possible.',
    experience: '14 years',
    degrees: ['MBBS', 'MS (Orthopaedics)', 'FRCS (Orthopaedics & Trauma)'],
    bmdcNumber: '39450',
    workingHospital: 'Centre for Orthopaedic & Trauma Surgery, Dhaka',
    totalPatients: 403,
    avgConsultationMinutes: 20,
    services: [
      'Sports Injuries',
      'Knee Replacement',
      'Hip Replacement',
      'Arthroscopy',
      'Fracture Management',
      'Ligament & Tendon Repair',
      'Back & Spine Pain',
      'Shoulder Disorders',
      'Foot & Ankle Conditions',
      'Osteoarthritis Management',
    ],
    experienceList: [
      {
        id: 'exp-5-1',
        hospitalName: 'Centre for Orthopaedic & Trauma Surgery, Dhaka',
        designation: 'Senior Consultant Orthopaedic Surgeon',
        department: 'Orthopaedics & Trauma',
        status: 'present',
        period: '2018 – Present',
      },
      {
        id: 'exp-5-2',
        hospitalName: 'Dhaka Medical College Hospital',
        designation: 'Registrar',
        department: 'Orthopaedics',
        status: 'past',
        period: '2012 – 2018',
      },
    ],
  },
  {
    id: 'doc-6',
    userId: 'u-doc-6',
    fullName: 'Dr. Lisa Wong',
    department: 'Dermatology',
    licenseNumber: 'LIC-99001',
    consultationFee: 900,
    followUpFee: 500,
    followUpDays: 14,
    isOnline: true,
    rating: 4.9,
    reviewCount: 412,
    about:
      'Dr. Lisa Wong is a renowned dermatologist with a dual mastery of medical and cosmetic dermatology. She is widely sought for her expertise in treating complex skin conditions and for delivering natural-looking aesthetic outcomes. Her evidence-based approach and warm bedside manner make her one of the most trusted names in dermatological care.',
    experience: '10 years',
    degrees: ['MBBS', 'DDV', 'FCPS (Dermatology & Venereology)'],
    bmdcNumber: '55102',
    workingHospital: 'Ibn Sina Diagnostic & Consultation Center, Dhanmondi',
    totalPatients: 621,
    avgConsultationMinutes: 15,
    services: [
      'Acne & Acne Scarring',
      'Eczema & Dermatitis',
      'Psoriasis',
      'Urticaria & Hives',
      'Fungal Skin Infections',
      'Vitiligo',
      'Hair Loss (Alopecia)',
      'Skin Allergy Testing',
      'Rosacea',
      'Mole & Lesion Assessment',
    ],
    experienceList: [
      {
        id: 'exp-6-1',
        hospitalName: 'Ibn Sina Diagnostic & Consultation Center, Dhanmondi',
        designation: 'Consultant Dermatologist',
        department: 'Dermatology & Venereology',
        status: 'present',
        period: '2020 – Present',
      },
      {
        id: 'exp-6-2',
        hospitalName: 'Skin & VD Department, Dhaka Medical College Hospital',
        designation: 'Senior Registrar',
        department: 'Dermatology',
        status: 'past',
        period: '2015 – 2020',
      },
    ],
  },
];

export const MOCK_DOCTORS: Doctor[] = BASE_MOCK_DOCTORS.map((doc, index) => ({
  ...doc,
  image: doctorPlaceholders[index % doctorPlaceholders.length],
}));

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
  getDoctors: async (categoryId?: string): Promise<Doctor[]> => {
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
  getDoctorDetails: async (id: string): Promise<Doctor | null> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_DOCTORS.find((doc) => doc.id === id) ?? null;
  },

  /**
   * Retrieves the current user's consultation history.
   * To test the empty state, toggle `returnEmpty` to true.
   */
  getConsultationHistory: async (): Promise<ConsultationHistoryItem[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const returnEmpty = false; // Toggle this to test the new user empty-history case

    if (returnEmpty) {
      return [];
    }

    const baseHistory: ConsultationHistoryItem[] = [
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

    return baseHistory.map((item) => {
      const doc = MOCK_DOCTORS.find((d) => d.id === item.doctorId);
      return { ...item, image: doc?.image };
    });
  },
};
