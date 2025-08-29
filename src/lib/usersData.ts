// lib/usersData.ts
export interface User {
  id: number;
  username: string;
  password: string;
}

export const users: User[] = [
  {
    id: 1,
    username: "admin",
    password: "password123"
  },
  {
    id: 2,
    username: "doctor",
    password: "medic2024"
  }
];

export const getUserByCredentials = (username: string, password: string): User | null => {
  return users.find(u => u.username === username && u.password === password) || null;
};

export const getAllUsers = (): User[] => {
  return users;
};