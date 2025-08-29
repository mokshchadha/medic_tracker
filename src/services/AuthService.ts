// services/AuthService.ts
import { getUserByCredentials } from '@/lib/usersData';

interface Session {
  sessionId: string;
  username: string;
  userId: number;
  createdAt: number;
}

export class AuthService {
  private static sessions: Map<string, Session> = new Map();
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static authenticate(username: string, password: string): { success: boolean; sessionId?: string; username?: string; error?: string } {
    const user = getUserByCredentials(username, password);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    const sessionId = crypto.randomUUID();
    const session: Session = {
      sessionId,
      username: user.username,
      userId: user.id,
      createdAt: Date.now()
    };

    this.sessions.set(sessionId, session);
    console.log(`User ${username} logged in with session ${sessionId}`);

    return {
      success: true,
      sessionId,
      username: user.username
    };
  }

  static validateSession(sessionId: string): { valid: boolean; username?: string; userId?: number } {
    if (!sessionId) {
      return { valid: false };
    }

    const session = this.sessions.get(sessionId);
    
    if (!session) {
      console.log(`Session ${sessionId} not found`);
      return { valid: false };
    }

    const sessionAge = Date.now() - session.createdAt;

    if (sessionAge > this.SESSION_DURATION) {
      console.log(`Session ${sessionId} expired`);
      this.sessions.delete(sessionId);
      return { valid: false };
    }

    console.log(`Session ${sessionId} is valid for user ${session.username}`);
    return {
      valid: true,
      username: session.username,
      userId: session.userId
    };
  }

  static logout(sessionId: string): void {
    console.log(`Logging out session ${sessionId}`);
    this.sessions.delete(sessionId);
  }

  static cleanupExpiredSessions(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.createdAt > this.SESSION_DURATION) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired sessions`);
    }
  }

  static getActiveSessions(): number {
    this.cleanupExpiredSessions();
    return this.sessions.size;
  }

  static hasActiveSession(username: string): boolean {
    for (const session of this.sessions.values()) {
      if (session.username === username) {
        const sessionAge = Date.now() - session.createdAt;
        if (sessionAge <= this.SESSION_DURATION) {
          return true;
        }
      }
    }
    return false;
  }

  // Debug method to list all active sessions
  static debugSessions(): void {
    console.log('Active sessions:', Array.from(this.sessions.values()).map(s => ({
      sessionId: s.sessionId,
      username: s.username,
      age: Date.now() - s.createdAt
    })));
  }
}