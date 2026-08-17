import Constants from 'expo-constants';
import { Hospital } from '../../types/medical.types';
import { Doctor } from './doctorsService';
import { maleDoctorPlaceholders, femaleDoctorPlaceholders } from '../../constants/images';

const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_BASE_URL = `http://${localhost}:8000/api/v1`;

export const hospitalsService = {
  async getNearbyHospitals(lat?: number, lng?: number): Promise<Hospital[]> {
    let url = `${API_BASE_URL}/hospitals/nearby`;
    if (lat !== undefined && lng !== undefined) {
      url += `?lat=${lat}&lng=${lng}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch nearby hospitals');
    return response.json();
  },

  async searchHospitals(query: string): Promise<Hospital[]> {
    const response = await fetch(`${API_BASE_URL}/hospitals/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search hospitals');
    return response.json();
  },

  async getHospitalDetails(id: string): Promise<{ hospital: Hospital; doctors: Doctor[] }> {
    // 1. Fetch Hospital
    const hospRes = await fetch(`${API_BASE_URL}/hospitals/${id}`);
    if (!hospRes.ok) throw new Error('Hospital not found');
    const hospital = await hospRes.json();

    // 2. Fetch Doctors working at this hospital (The new discovery workflow)
    const docsRes = await fetch(`${API_BASE_URL}/doctors/by-hospital/${id}`);
    let doctors: Doctor[] = [];
    if (docsRes.ok) {
      const rawDocs = await docsRes.json();
      doctors = rawDocs.map((doc: any, index: number) => {
        const isFemale = doc.gender?.toLowerCase() === 'female';
        const placeholders = isFemale ? femaleDoctorPlaceholders : maleDoctorPlaceholders;
        return {
          ...doc,
          image: placeholders[index % placeholders.length],
        };
      });
    }

    return { hospital, doctors };
  },
};
