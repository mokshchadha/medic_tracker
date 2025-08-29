// lib/authUtils.ts
import fs from 'fs';
import path from 'path';

interface User {
  id: number;
  username: string;
  password: string;
}

export class AuthUtils {
  private static usersFilePath = path.join(process.cwd(), 'lib', 'users.json');

  // Load users from users.json (only works in API routes, not middleware)
  static getUsers(): User[] {
    try {
      const fileContent = fs.readFileSync(this.usersFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  // Authenticate user with username and password
  static authenticateUser(username: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.username === username && u.password === password) || null;
  }
}