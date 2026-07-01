import { mmkvStorage } from '../../store/storage';
import { UserRole } from '../../store/authStore';

// We use mmkvStorage to mock a persistent backend DB for the session.
// Key for users map: 'mock_backend_users'
const USERS_DB_KEY = 'mock_backend_users';

interface MockUser {
  id: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'pending';
  profileData: any;
}

const getMockUsers = (): Record<string, MockUser> => {
  const data = mmkvStorage.getItem(USERS_DB_KEY);
  return data ? JSON.parse(data as string) : {};
};

const saveMockUsers = (users: Record<string, MockUser>) => {
  mmkvStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  /**
   * Mocks sending an OTP to a phone number.
   */
  async sendOtp(phone: string): Promise<void> {
    await delay(500); // Simulate network
    // For dev purposes, the OTP is always 123456. No actual sending happens.
  },

  /**
   * Mocks verifying an OTP.
   * Fixed dev OTP: 123456.
   */
  async verifyOtp(
    phone: string,
    otp: string,
  ): Promise<{ isNewUser: true } | { isNewUser: false; token: string; user: MockUser }> {
    await delay(500);

    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    const users = getMockUsers();
    // Search for user by phone
    const user = Object.values(users).find((u) => u.phone === phone);

    if (user) {
      return {
        isNewUser: false,
        token: `mock-token-${user.id}`,
        user,
      };
    }

    return { isNewUser: true };
  },

  /**
   * Mocks identity registration for a new user.
   */
  async register(
    phone: string,
    role: UserRole,
    profileData: any,
  ): Promise<{ token: string; user: MockUser }> {
    await delay(800);

    const users = getMockUsers();

    // Simple id generation
    const newId = `usr_${Date.now()}`;
    const status = role === 'doctor' ? 'pending' : 'active';

    const newUser: MockUser = {
      id: newId,
      phone,
      role,
      status,
      profileData,
    };

    users[newId] = newUser;
    saveMockUsers(users);

    return {
      token: `mock-token-${newId}`,
      user: newUser,
    };
  },
};
