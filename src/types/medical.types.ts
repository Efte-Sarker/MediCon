export interface PatientProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string; // ISO 8601
  bloodGroup: string;
  heightCm?: number;
  weightKg?: number;
  allergies: string[];
  chronicConditions: string[];
}

export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  department: string;
  licenseNumber: string;
  consultationFee: number;
  isOnline: boolean;
  rating: number;
  reviewCount: number;
  about: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string; // ISO 8601
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  mode: 'IN_PERSON' | 'VIDEO';
  notes?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId?: string; // Optional if uploaded manually
  issuedAt: string; // ISO 8601
  medicines: PrescriptionMedicine[];
  notes?: string;
  imageUrl?: string;
}

export interface PrescriptionMedicine {
  id: string;
  name: string;
  dosage: string;
  durationDays: number;
  frequency: string;
  instructions?: string;
  aiDemystifierSummary?: string; // Mock explanation of the drug
}

export type AdherenceStatus = 'TAKEN' | 'PENDING' | 'MISSED';

export interface AdherenceRecord {
  id: string;
  prescriptionId: string;
  medicineId: string;
  date: string; // ISO 8601 (YYYY-MM-DD)
  status: AdherenceStatus;
  scheduledTime?: string; // HH:mm format
  takenTime?: string; // ISO 8601 if taken
}

export interface Biomarker {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
  isFlagged: boolean;
}

export interface Report {
  id: string;
  patientId: string;
  title: string;
  type: string; // e.g., 'BLOOD_TEST', 'XRAY'
  date: string; // ISO 8601
  laboratory?: string;
  imageUrl?: string;
  fileUri?: string; // For newly uploaded documents/PDFs
  biomarkers?: Biomarker[];
  aiSummary?: string;
}

export interface Medicine {
  id: string;
  genericName: string;
  brandName: string;
  therapeuticClass: string;
  forms: string[]; // e.g., 'Tablet', 'Syrup'
  sideEffects: string[];
  contraindications: string[];
}

export interface Question {
  id: string;
  patientId: string;
  department: string;
  content: string;
  createdAt: string; // ISO 8601
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: string;
  doctorId: string;
  content: string;
  createdAt: string; // ISO 8601
}

export interface EmergencyContact {
  id: string;
  patientId: string;
  name: string;
  phoneNumber: string;
  relationship: string;
}

export interface VitalReading {
  id: string;
  patientId: string;
  type: 'BLOOD_PRESSURE' | 'HEART_RATE' | 'TEMPERATURE' | 'OXYGEN_LEVEL' | 'BLOOD_SUGAR';
  value: string; // Stored as string for flexibility (e.g. "120/80")
  unit: string;
  recordedAt: string; // ISO 8601
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  emergencyNumber?: string;
  hasEmergencyRoom: boolean;
  distanceKm?: number;
  isOpen24x7: boolean;
  imageUrl?: string;
}
