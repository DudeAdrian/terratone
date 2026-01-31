/**
 * AuthService - User authentication and session management
 * Handles login, registration, and role-based permissions
 */

class AuthService {
  constructor() {
    this.currentUser = null;
    this.sessionKey = "harmonic_session";
    this.initialized = false;
  }

  initialize() {
    // Load session from localStorage
    const stored = localStorage.getItem(this.sessionKey);
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (this.isSessionValid(session)) {
          this.currentUser = session.user;
          console.log(`[AuthService] Session restored for ${this.currentUser.name}`);
        } else {
          this.clearSession();
        }
      } catch (error) {
        console.error("[AuthService] Error restoring session:", error);
        this.clearSession();
      }
    }
    this.initialized = true;
  }

  /**
   * Login with email and password
   */
  async login(email, password) {
    try {
      // TODO: Replace with real API call
      // const response = await fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      
      // Mock login for now
      if (email && password) {
        const user = {
          id: "user-" + Date.now(),
          email,
          name: email.split("@")[0],
          role: email.includes("admin") ? "admin" : "member",
          community: "Harmonic Valley",
          joinDate: new Date().toISOString(),
          avatar: this.getAvatarForEmail(email),
        };

        this.setSession(user);
        return { success: true, user };
      }

      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      console.error("[AuthService] Login failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Register new user
   */
  async register(email, password, name, community) {
    try {
      // TODO: Replace with real API call
      const user = {
        id: "user-" + Date.now(),
        email,
        name,
        role: "member",
        community,
        joinDate: new Date().toISOString(),
        avatar: this.getAvatarForEmail(email),
      };

      this.setSession(user);
      return { success: true, user };
    } catch (error) {
      console.error("[AuthService] Registration failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Logout current user
   */
  logout() {
    this.currentUser = null;
    this.clearSession();
    console.log("[AuthService] User logged out");
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.currentUser !== null;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role) {
    return this.currentUser && this.currentUser.role === role;
  }

  /**
   * Check if user has permission
   */
  hasPermission(permission) {
    if (!this.currentUser) return false;

    const rolePermissions = {
      admin: ["all"],
      member: ["read", "write", "comment"],
      guest: ["read"],
    };

    const userPermissions = rolePermissions[this.currentUser.role] || [];
    return userPermissions.includes("all") || userPermissions.includes(permission);
  }

  /**
   * Set user session
   */
  setSession(user) {
    const session = {
      user,
      token: this.generateToken(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    localStorage.setItem(this.sessionKey, JSON.stringify(session));
    this.currentUser = user;
  }

  /**
   * Clear session
   */
  clearSession() {
    localStorage.removeItem(this.sessionKey);
    this.currentUser = null;
  }

  /**
   * Check if session is valid
   */
  isSessionValid(session) {
    if (!session || !session.expiresAt) return false;
    return new Date(session.expiresAt) > new Date();
  }

  /**
   * Generate mock token
   */
  generateToken() {
    return "token_" + Math.random().toString(36).substring(2) + Date.now();
  }

  /**
   * Get avatar emoji based on email
   */
  getAvatarForEmail(email) {
    const avatars = ["👤", "👨", "👩", "🧑", "👨‍💼", "👩‍💼", "👨‍🌾", "👩‍🌾"];
    const index = email.charCodeAt(0) % avatars.length;
    return avatars[index];
  }

  /**
   * Update user profile
   */
  async updateProfile(updates) {
    if (!this.currentUser) return { success: false, error: "Not authenticated" };

    try {
      // TODO: Replace with real API call
      this.currentUser = { ...this.currentUser, ...updates };
      
      const stored = localStorage.getItem(this.sessionKey);
      if (stored) {
        const session = JSON.parse(stored);
        session.user = this.currentUser;
        localStorage.setItem(this.sessionKey, JSON.stringify(session));
      }

      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error("[AuthService] Profile update failed:", error);
      return { success: false, error: error.message };
    }
  }
}

const authService = new AuthService();
export default authService;
