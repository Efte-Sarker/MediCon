import { SystemNotification } from '../../types/medical.types';
import { mockFetch } from '../api/mockClient';

// Mock notifications database
const mockNotifications: SystemNotification[] = [
  {
    id: 'n-1',
    userId: 'patient-1',
    title: 'Upcoming Appointment',
    message: 'You have a consultation with Dr. Smith tomorrow at 10:00 AM.',
    type: 'REMINDER',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    actionUrl: '/(app)/doctors/booking',
  },
  {
    id: 'n-2',
    userId: 'patient-1',
    title: 'Question Answered',
    message: 'Dr. Jones has answered your question in the Q&A inbox.',
    type: 'QNA_ANSWER',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    actionUrl: '/(app)/doctors/qna',
  },
  {
    id: 'n-3',
    userId: 'patient-1',
    title: 'Prescription Ready',
    message: 'A new prescription has been added to your profile.',
    type: 'SYSTEM',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    actionUrl: '/(app)/prescriptions',
  },
];

class NotificationsListService {
  /**
   * Fetch all notifications for a specific user.
   */
  async getNotifications(userId: string): Promise<SystemNotification[]> {
    const data = mockNotifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return mockFetch(data);
  }

  /**
   * Toggle the read status of a specific notification.
   */
  async markAsRead(notificationId: string): Promise<SystemNotification> {
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = !notification.isRead;
    return mockFetch(notification);
  }
}

export const notificationsListService = new NotificationsListService();
