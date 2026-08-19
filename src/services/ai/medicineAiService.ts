import Constants from 'expo-constants';
export interface MedicineExplainerResult {
  className: string;
  forms: string[];
  sideEffects: string[];
  dietaryConflicts: string[];
  summary: string;
}

export interface ComparisonResult {
  similarities: string[];
  differences: string[];
  rationale: string;
}

export interface InteractionConflict {
  existingMedicineId: string;
  existingMedicineName: string;
  severity: 'SAFE' | 'MINOR' | 'SEVERE';
  explanation: string;
}

const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost';
const API_BASE_URL = `http://${localhost}:8000`;

export const medicineAiService = {
  getMedicineExplainer: async (medicineName: string): Promise<MedicineExplainerResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/medicines/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicineName }),
      });
      if (!response.ok) throw new Error('Failed to explain medicine');
      return await response.json();
    } catch (error) {
      console.warn('Error fetching medicine explainer:', error);
      // Fallback
      return {
        className: 'Unknown',
        forms: [],
        sideEffects: [],
        dietaryConflicts: [],
        summary: 'Error fetching AI explanation. Please check your connection.',
      };
    }
  },

  compareMedicines: async (medA: string, medB: string): Promise<ComparisonResult> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/medicines/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medA, medB }),
      });
      if (!response.ok) throw new Error('Failed to compare medicines');
      return await response.json();
    } catch (error) {
      console.warn('Error fetching medicine comparison:', error);
      // Fallback
      return {
        similarities: [],
        differences: [],
        rationale: 'Error comparing medicines. Please check your connection.',
      };
    }
  },

  checkInteractions: async (
    newMedicine: string,
    existingMedicines: { id: string; name: string }[],
  ): Promise<InteractionConflict[]> => {
    if (existingMedicines.length === 0) return [];

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/medicines/interactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newMedicine, existingMedicines }),
      });
      if (!response.ok) throw new Error('Failed to check interactions');
      const data = await response.json();
      return data.conflicts;
    } catch (error) {
      console.warn('Error fetching drug interactions:', error);
      // Fallback
      return existingMedicines.map((m) => ({
        existingMedicineId: m.id,
        existingMedicineName: m.name,
        severity: 'SAFE',
        explanation: 'Error checking interactions. Please check your connection.',
      }));
    }
  },
};
