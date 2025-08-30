// src/services/AuthService.ts
import { getUserByCredentials } from '@/lib/usersData';
import dbConnect from '@/lib/mongodb';

// Lazy import Session model to avoid issues during middleware compilation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let SessionModel: any = null;

const getSessionModel = async () => {
  if (!SessionModel) {
    const { default: Session } = await import('@/models/Session');
    SessionModel = Session;
  }
  return SessionModel;
};

export class AuthService {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static async authenticate(username: string, password: string): Promise<{ success: boolean; sessionId?: string; username?: string; error?: string }> {
    const user = getUserByCredentials(username, password);

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    try {
      await dbConnect();
      const Session = await getSessionModel();
      
      const sessionId = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

      await Session.create({
        sessionId,
        username: user.username,
        userId: user.id,
        expiresAt
      });

      console.log(`User ${username} logged in with session ${sessionId}`);

      return {
        success: true,
        sessionId,
        username: user.username
      };
    } catch (error) {
      console.error('Session creation error:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async validateSession(sessionId: string): Promise<{ valid: boolean; username?: string; userId?: number }> {
    if (!sessionId) {
      return { valid: false };
    }

    try {
      await dbConnect();
      const Session = await getSessionModel();
      
      const session = await Session.findOne({
        sessionId,
        expiresAt: { $gt: new Date() } // Only get non-expired sessions
      });

      if (!session) {
        console.log(`Session ${sessionId} not found or expired`);
        return { valid: false };
      }

      console.log(`Session ${sessionId} is valid for user ${session.username}`);
      return {
        valid: true,
        username: session.username,
        userId: session.userId
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return { valid: false };
    }
  }

  static async logout(sessionId: string): Promise<void> {
    if (!sessionId) return;

    try {
      await dbConnect();
      const Session = await getSessionModel();
      await Session.deleteOne({ sessionId });
      console.log(`Session ${sessionId} logged out and deleted`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await dbConnect();
      const Session = await getSessionModel();
      const result = await Session.deleteMany({
        expiresAt: { $lt: new Date() }
      });
      
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} expired sessions`);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }
}