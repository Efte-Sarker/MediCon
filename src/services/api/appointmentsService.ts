import { useScheduleStore } from '../../store/scheduleStore';
import { doctorsService } from './doctorsService';

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
   * Get available slots for a given doctor and date, applying capacity and exception logic.
   */
  async getAvailableSlots(doctorId: string, date: string): Promise<TimeSlot[]> {
    // 1. Fetch doctor to get avgConsultationMinutes
    const doctor = await doctorsService.getDoctorDetails(doctorId);
    if (!doctor) return [];

    // Assuming a 60-minute time block for slots.
    // Capacity = 60 / avgConsultationMinutes
    const capacity = Math.floor(60 / doctor.avgConsultationMinutes);

    // 2. Determine day of week
    const d = new Date(date);
    const dayOfWeek = d.getDay(); // 0 (Sun) to 6 (Sat)

    // 3. Get from Zustand store
    const store = useScheduleStore.getState();
    const regularSlots = store.regularSchedule[dayOfWeek] || [];
    const exceptionsForDate = store.scheduleExceptions[date] || {};
    const bookingsForDate = store.bookings[date] || {};

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 4. Map to TimeSlot array
    return regularSlots.map((timeStr, index) => {
      const isExceptionDisabled = exceptionsForDate[timeStr] === false;
      const currentBookings = bookingsForDate[timeStr] || 0;
      let isFull = currentBookings >= capacity;

      // Mock visualization: Scatter disabled slots pseudo-randomly based on date and index
      // so it looks natural and not aligned in the same columns.
      const dayOfMonth = d.getDate();
      const pseudoRandom = (dayOfMonth * 31 + index * 17) % 10;
      if (pseudoRandom < 2) {
        // roughly 20% chance for a slot to be disabled
        isFull = true;
      }

      return {
        id: timeStr,
        time: timeStr,
        isAvailable: !isExceptionDisabled && !isFull,
      };
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
    // Increment booking in the store
    const store = useScheduleStore.getState();
    store.incrementBooking(details.date, details.timeSlotId);

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
