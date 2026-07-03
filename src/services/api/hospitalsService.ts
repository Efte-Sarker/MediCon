import { Hospital } from '../../types/medical.types';
import { MOCK_DOCTORS, Doctor } from './doctorsService';

// Fake delay to simulate network
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: 'hosp_1',
    name: 'City General Hospital',
    address: '123 Health Ave, Medical District',
    latitude: 40.7128,
    longitude: -74.006,
    contactNumber: '+1 555-0100',
    emergencyNumber: '+1 555-0911',
    hasEmergencyRoom: true,
    distanceKm: 1.2,
    isOpen24x7: true,
    imageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'hosp_2',
    name: 'Oakridge Specialty Clinic',
    address: '456 Wellness Blvd, Northside',
    latitude: 40.72,
    longitude: -73.995,
    contactNumber: '+1 555-0200',
    hasEmergencyRoom: false,
    distanceKm: 3.5,
    isOpen24x7: false,
    imageUrl:
      'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'hosp_3',
    name: 'Metro Care Center',
    address: '789 Central St, Downtown',
    latitude: 40.715,
    longitude: -74.01,
    contactNumber: '+1 555-0300',
    emergencyNumber: '+1 555-0912',
    hasEmergencyRoom: true,
    distanceKm: 5.0,
    isOpen24x7: true,
    imageUrl:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
  },
];

export const hospitalsService = {
  async getNearbyHospitals(lat?: number, lng?: number): Promise<Hospital[]> {
    await delay(800);
    // In a real app, we'd sort by distance from lat/lng
    return [...MOCK_HOSPITALS];
  },

  async getHospitalDetails(id: string): Promise<{ hospital: Hospital; doctors: Doctor[] }> {
    await delay(600);
    const hospital = MOCK_HOSPITALS.find((h) => h.id === id);
    if (!hospital) {
      throw new Error('Hospital not found');
    }

    // Mock affiliated doctors
    // In a real scenario, this would filter doctors by hospitalId
    // We'll just return a subset of doctors to simulate it
    const doctors = MOCK_DOCTORS.slice(0, 3);

    return { hospital, doctors };
  },
};
