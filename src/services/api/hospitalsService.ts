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
    const hospitals = await response.json();
    
    // Map hospital IDs to real images
    const realImages: Record<string, string> = {
      'hosp_001': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Square_hospital_01.jpg',
      'hosp_002': 'https://images.unsplash.com/photo-1587351021759-3e566d6af7cc?q=80&w=800&auto=format&fit=crop',
      'hosp_003': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      'hosp_004': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop',
    };

    return hospitals.map((h: any) => ({
      ...h,
      imageUrl: realImages[h.id] || h.imageUrl,
    }));
  },

  async searchHospitals(query: string): Promise<Hospital[]> {
    const response = await fetch(
      `${API_BASE_URL}/hospitals/search?query=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error('Failed to search hospitals');
    const hospitals = await response.json();
    
    // Map hospital IDs to real images
    const realImages: Record<string, string> = {
      'hosp_001': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Square_hospital_01.jpg',
      'hosp_002': 'https://images.unsplash.com/photo-1587351021759-3e566d6af7cc?q=80&w=800&auto=format&fit=crop',
      'hosp_003': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      'hosp_004': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop',
    };

    return hospitals.map((h: any) => ({
      ...h,
      imageUrl: realImages[h.id] || h.imageUrl,
    }));
  },

  async getHospitalDetails(id: string): Promise<{ hospital: Hospital; doctors: Doctor[] }> {
    // 1. Fetch Hospital
    const hospRes = await fetch(`${API_BASE_URL}/hospitals/${id}`);
    if (!hospRes.ok) throw new Error('Hospital not found');
    let hospital = await hospRes.json();
    
    const realImages: Record<string, string> = {
      'hosp_001': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Square_hospital_01.jpg',
      'hosp_002': 'https://images.unsplash.com/photo-1587351021759-3e566d6af7cc?q=80&w=800&auto=format&fit=crop',
      'hosp_003': 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop',
      'hosp_004': 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=800&auto=format&fit=crop',
    };
    
    if (realImages[hospital.id]) {
      hospital.imageUrl = realImages[hospital.id];
    } else if (!hospital.imageUrl || hospital.imageUrl.includes('example.com')) {
      hospital.imageUrl = `https://placehold.co/600x400/40566d/F4FAFC.png?text=${encodeURIComponent(hospital.name)}`;
    }

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
