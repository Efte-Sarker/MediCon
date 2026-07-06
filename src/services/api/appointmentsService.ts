export type ConsultationType = 'in-person' | 'video';

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface DigestData {
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
  medicines: string[];
  reports: { id: string; name: string; date: string }[];
}

export interface BookingDetails {
  doctorId: string;
  date: string;
  timeSlotId: string;
  type: ConsultationType;
}

export interface BookingResult {
  success: boolean;
  appointmentId?: string;
  message?: string;
}

class AppointmentsService {
  /**
   * Mock getting available slots for a given doctor and date.
   */
  async getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Generate mock slots
        resolve([
          { id: 't1', time: '09:00 AM', isAvailable: true },
          { id: 't2', time: '09:30 AM', isAvailable: false },
          { id: 't3', time: '10:00 AM', isAvailable: true },
          { id: 't4', time: '11:00 AM', isAvailable: true },
          { id: 't5', time: '02:00 PM', isAvailable: true },
          { id: 't6', time: '03:30 PM', isAvailable: false },
          { id: 't7', time: '04:00 PM', isAvailable: true },
        ]);
      }, 500);
    });
  }

  /**
   * Mock getting pre-consultation digest.
   */
  async getPreConsultationDigest(patientId: string): Promise<DigestData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          vitals: {
            bloodPressure: '120/80',
            heartRate: 72,
            temperature: 98.6,
            weight: 70,
          },
          medicines: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
          reports: [
            { id: 'r1', name: 'Complete Blood Count', date: '2026-06-15' },
            { id: 'r2', name: 'Lipid Panel', date: '2026-06-15' },
          ],
        });
      }, 500);
    });
  }

  /**
   * Mock booking the appointment.
   */
  async bookAppointment(details: BookingDetails): Promise<BookingResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          appointmentId: `apt-${Math.floor(Math.random() * 10000)}`,
        });
      }, 1500);
    });
  }
}

export const appointmentsService = new AppointmentsService();
