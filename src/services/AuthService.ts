import { UserProfile, DeliveryAddress } from '../types';
import { DEMO_ADMIN_USER } from './dbStore';

const AUTH_STORAGE_KEY = 'mf_auth_user_v1';
const USERS_LIST_KEY = 'mf_registered_users_v1';

class AuthService {
  private getUsers(): (UserProfile & { passwordHash: string })[] {
    try {
      const data = localStorage.getItem(USERS_LIST_KEY);
      if (!data) {
        return [
          {
            ...DEMO_ADMIN_USER,
            passwordHash: 'admin123',
          }
        ];
      }
      return JSON.parse(data);
    } catch {
      return [{ ...DEMO_ADMIN_USER, passwordHash: 'admin123' }];
    }
  }

  private saveUsers(users: (UserProfile & { passwordHash: string })[]): void {
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
  }

  getCurrentUser(): UserProfile | null {
    try {
      const data = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  login(email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    
    // Check admin convenience shortcut
    if (trimmedEmail === 'admin@mrfrozen.pk' && (password === 'admin123' || password === 'Admin@123')) {
      const admin = DEMO_ADMIN_USER;
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
      return { success: true, user: admin };
    }

    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return { success: false, error: 'No account found with this email. Please register.' };
    }

    if (found.passwordHash !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    const { passwordHash: _, ...cleanProfile } = found;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cleanProfile));
    return { success: true, user: cleanProfile };
  }

  register(fullName: string, email: string, phoneNumber: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, error: 'An account with this email already exists. Please login.' };
    }

    const newUser: UserProfile & { passwordHash: string } = {
      id: `usr-${Date.now()}`,
      email: trimmedEmail,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      role: 'customer',
      savedAddresses: [],
      wishlistProductIds: [],
      createdAt: new Date().toISOString(),
      passwordHash: password,
    };

    users.push(newUser);
    this.saveUsers(users);

    const { passwordHash: _, ...cleanProfile } = newUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(cleanProfile));
    return { success: true, user: cleanProfile };
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  saveAddress(address: DeliveryAddress): UserProfile | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    user.savedAddresses = user.savedAddresses || [];
    user.savedAddresses.push(address);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

    // Update in user list
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx].savedAddresses = user.savedAddresses;
      this.saveUsers(users);
    }

    return user;
  }

  toggleWishlist(productId: string): string[] {
    const user = this.getCurrentUser();
    let wishlist: string[] = [];

    if (user) {
      user.wishlistProductIds = user.wishlistProductIds || [];
      const index = user.wishlistProductIds.indexOf(productId);
      if (index >= 0) {
        user.wishlistProductIds.splice(index, 1);
      } else {
        user.wishlistProductIds.push(productId);
      }
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      wishlist = user.wishlistProductIds;
    } else {
      // Local guest wishlist
      try {
        const raw = localStorage.getItem('mf_guest_wishlist');
        wishlist = raw ? JSON.parse(raw) : [];
        const index = wishlist.indexOf(productId);
        if (index >= 0) {
          wishlist.splice(index, 1);
        } else {
          wishlist.push(productId);
        }
        localStorage.setItem('mf_guest_wishlist', JSON.stringify(wishlist));
      } catch {
        wishlist = [productId];
      }
    }

    return wishlist;
  }

  getWishlist(): string[] {
    const user = this.getCurrentUser();
    if (user && user.wishlistProductIds) {
      return user.wishlistProductIds;
    }
    try {
      const raw = localStorage.getItem('mf_guest_wishlist');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}

export const authService = new AuthService();
