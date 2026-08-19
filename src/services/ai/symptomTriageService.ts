import Constants from 'expo-constants';
import { Doctor, DEMO_MOCK_DOCTORS } from '../api/doctorsService';
import { femaleDoctorPlaceholders, maleDoctorPlaceholders } from '../../constants/images';

// DEMO ONLY: presentation-layer slice for capstone demo. Real Phase 2 ranking
// (2.9) must return the full ranked list; do not carry this flag or its slicing
// behavior into the real service.
export const DEMO_SHOWCASE_MODE = true;

// Backend URL. Use 10.0.2.2 for Android emulator, or your machine's IP for physical devices.
const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_BASE_URL = `http://${localhost}:8000`;

class SymptomTriageService {
  /**
   * Calls the backend API to parse a symptom query via Gemini
   * and returns a dynamically ranked list of relevant doctors.
   */
  async searchDoctorsBySymptom(query: string): Promise<Doctor[]> {
    // For demo purposes, we bypass the real backend and return the mock pool
    let results = [...DEMO_MOCK_DOCTORS];

    const lowerQuery = query.toLowerCase();
    const isDirectCategoryMatch = lowerQuery === 'fever & cold' || lowerQuery === 'fever, cold';

    if (isDirectCategoryMatch) {
      // Category search: default sort by rating, no AI slicing
      results.sort((a, b) => b.rating - a.rating);
    } else if (lowerQuery.includes('fever') || lowerQuery.includes('joint')) {
      // Simulate NLS ranking: if query indicates high fever/joint pain, rank by experience for elevated risk
      results.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
    } else {
      // Default sort by rating
      results.sort((a, b) => b.rating - a.rating);
    }

    // Apply images to results to maintain UI consistency
    results = results.map((doc, index) => {
      const isFemale = doc.gender?.toLowerCase() === 'female';
      const placeholders = isFemale ? femaleDoctorPlaceholders : maleDoctorPlaceholders;
      return {
        ...doc,
        image: placeholders[index % placeholders.length],
      };
    });

    if (DEMO_SHOWCASE_MODE && !isDirectCategoryMatch) {
      return results.slice(0, 1);
    }

    return results;
  }
}

export const symptomTriageService = new SymptomTriageService();
