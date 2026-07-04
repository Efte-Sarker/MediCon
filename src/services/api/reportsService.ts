import { Report } from '../../types/medical.types';

// Mock list of previously parsed reports
const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-1',
    patientId: 'pat-1',
    title: 'Complete Blood Count (CBC)',
    type: 'BLOOD_TEST',
    date: '2026-06-15T08:30:00Z',
    laboratory: 'Central Diagnostic Lab',
    aiSummary:
      'Your CBC shows mildly elevated white blood cells, which could indicate a minor infection or inflammation. Hemoglobin and platelet counts are well within normal ranges. Please consult your physician if you are experiencing any symptoms like fever.',
    biomarkers: [
      {
        id: 'b-1',
        name: 'Hemoglobin',
        value: 14.2,
        unit: 'g/dL',
        referenceRange: '13.5 - 17.5',
        isFlagged: false,
      },
      {
        id: 'b-2',
        name: 'White Blood Cells (WBC)',
        value: 11.5,
        unit: 'x10^9/L',
        referenceRange: '4.5 - 11.0',
        isFlagged: true,
      },
      {
        id: 'b-3',
        name: 'Platelet Count',
        value: 250,
        unit: 'x10^9/L',
        referenceRange: '150 - 450',
        isFlagged: false,
      },
    ],
  },
  {
    id: 'rep-2',
    patientId: 'pat-1',
    title: 'Lipid Panel',
    type: 'BLOOD_TEST',
    date: '2025-11-10T09:00:00Z',
    laboratory: 'City Health Clinic',
    aiSummary:
      'Your lipid panel shows elevated LDL (bad cholesterol) and borderline high total cholesterol. HDL (good cholesterol) is normal. Your doctor may recommend dietary changes or exercise to improve these numbers.',
    biomarkers: [
      {
        id: 'b-4',
        name: 'Total Cholesterol',
        value: 210,
        unit: 'mg/dL',
        referenceRange: '< 200',
        isFlagged: true,
      },
      {
        id: 'b-5',
        name: 'HDL Cholesterol',
        value: 45,
        unit: 'mg/dL',
        referenceRange: '> 40',
        isFlagged: false,
      },
      {
        id: 'b-6',
        name: 'LDL Cholesterol',
        value: 140,
        unit: 'mg/dL',
        referenceRange: '< 100',
        isFlagged: true,
      },
      {
        id: 'b-7',
        name: 'Triglycerides',
        value: 125,
        unit: 'mg/dL',
        referenceRange: '< 150',
        isFlagged: false,
      },
    ],
  },
];

export const reportsService = {
  getReports: async (): Promise<Report[]> => {
    // Simulate network delay
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_REPORTS]), 800));
  },

  getReportDetails: async (id: string): Promise<Report> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const report = MOCK_REPORTS.find((r) => r.id === id);
        if (report) {
          resolve(report);
        } else {
          reject(new Error('Report not found'));
        }
      }, 500);
    });
  },

  uploadReport: async (fileUri: string, type: string, fileName: string): Promise<Report> => {
    // Simulate a long OCR / AI parsing process
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReport: Report = {
          id: `rep-mock-${Date.now()}`,
          patientId: 'pat-1',
          title: `Scanned ${fileName}`,
          type: type.includes('pdf') ? 'DOCUMENT' : 'IMAGE_SCAN',
          date: new Date().toISOString(),
          laboratory: 'Unknown',
          fileUri,
          aiSummary:
            'The uploaded document has been analyzed. We detected a standard metabolic panel. Glucose levels appear slightly above the fasting range, but other electrolytes are balanced. This is an AI generated summary; please consult a doctor.',
          biomarkers: [
            {
              id: 'b-new-1',
              name: 'Fasting Glucose',
              value: 105,
              unit: 'mg/dL',
              referenceRange: '70 - 99',
              isFlagged: true,
            },
            {
              id: 'b-new-2',
              name: 'Sodium',
              value: 140,
              unit: 'mEq/L',
              referenceRange: '135 - 145',
              isFlagged: false,
            },
            {
              id: 'b-new-3',
              name: 'Potassium',
              value: 4.2,
              unit: 'mEq/L',
              referenceRange: '3.6 - 5.2',
              isFlagged: false,
            },
          ],
        };
        MOCK_REPORTS.unshift(newReport); // Add to mock memory so it shows in list
        resolve(newReport);
      }, 2500); // 2.5 seconds delay to simulate real parsing
    });
  },
};
