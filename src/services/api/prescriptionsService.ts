import { Prescription, AdherenceRecord } from '../../types/medical.types';

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'pat-1',
    doctorId: 'doc-1',
    issuedAt: '2026-06-15T08:30:00Z',
    medicines: [
      {
        id: 'med-1',
        name: 'Amoxicillin',
        dosage: '500mg',
        durationDays: 7,
        frequency: '3 times a day',
        instructions: 'Take after meals',
        aiDemystifierSummary:
          'An antibiotic used to treat bacterial infections. It works by stopping the growth of bacteria. Finish the entire course even if you feel better.',
      },
      {
        id: 'med-2',
        name: 'Ibuprofen',
        dosage: '400mg',
        durationDays: 3,
        frequency: 'As needed',
        instructions: 'Take with food for pain',
        aiDemystifierSummary:
          'A nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.',
      },
    ],
  },
  {
    id: 'rx-2',
    patientId: 'pat-1',
    doctorId: 'doc-2',
    issuedAt: '2026-07-01T10:00:00Z',
    medicines: [
      {
        id: 'med-3',
        name: 'Lisinopril',
        dosage: '10mg',
        durationDays: 30,
        frequency: 'Once a day',
        instructions: 'Take in the morning',
        aiDemystifierSummary:
          'An ACE inhibitor used to treat high blood pressure. It relaxes blood vessels so blood flows more smoothly.',
      },
    ],
  },
];

const MOCK_ADHERENCE: AdherenceRecord[] = [
  {
    id: 'adh-1',
    prescriptionId: 'rx-1',
    medicineId: 'med-1',
    date: new Date().toISOString().split('T')[0],
    status: 'TAKEN',
    scheduledTime: '08:00',
    takenTime: new Date(new Date().setHours(8, 15)).toISOString(),
  },
  {
    id: 'adh-2',
    prescriptionId: 'rx-1',
    medicineId: 'med-1',
    date: new Date().toISOString().split('T')[0],
    status: 'PENDING',
    scheduledTime: '14:00',
  },
  {
    id: 'adh-3',
    prescriptionId: 'rx-2',
    medicineId: 'med-3',
    date: new Date().toISOString().split('T')[0],
    status: 'MISSED',
    scheduledTime: '09:00',
  },
];

export const prescriptionsService = {
  getPrescriptions: async (): Promise<Prescription[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PRESCRIPTIONS]), 600));
  },

  getPrescriptionDetails: async (id: string): Promise<Prescription> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const rx = MOCK_PRESCRIPTIONS.find((r) => r.id === id);
        if (rx) resolve(rx);
        else reject(new Error('Prescription not found'));
      }, 400);
    });
  },

  getDailyAdherence: async (date: string): Promise<AdherenceRecord[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const records = MOCK_ADHERENCE.filter((a) => a.date === date);
        resolve(records);
      }, 300);
    });
  },

  /**
   * Calculates the adherence threshold score based on taken and total doses.
   * Useful for grading adherence quality.
   */
  calculateAdherenceThreshold: (taken: number, total: number): 'GOOD' | 'FAIR' | 'POOR' => {
    if (total === 0) return 'GOOD'; // No meds = good? Or maybe N/A, but we'll return GOOD
    const percentage = (taken / total) * 100;

    if (percentage >= 80) return 'GOOD';
    if (percentage >= 50) return 'FAIR';
    return 'POOR';
  },
};
