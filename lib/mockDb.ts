import { User } from "@/types";

export interface StoredUser extends User {
  passwordHash: string;
}

export const mockUsers: StoredUser[] = [
  {
    id: "usr_1",
    name: "Alex Johnson",
    email: "admin@blackbox.dev",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "admin",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
    createdAt: new Date("2024-01-01").toISOString(),
    isVerified: true,
  },
  {
    id: "usr_2",
    name: "Sam Rivera",
    email: "dev@blackbox.dev",
    passwordHash: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password"
    role: "user",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sam",
    createdAt: new Date("2024-03-15").toISOString(),
    isVerified: true,
  },
];

export function findUserByEmail(email: string): StoredUser | undefined {
  return mockUsers.find((u) => u.email === email);
}

export function findUserById(id: string): StoredUser | undefined {
  return mockUsers.find((u) => u.id === id);
}

export function createUser(data: Omit<StoredUser, "id" | "createdAt">): StoredUser {
  const user: StoredUser = {
    ...data,
    id: `usr_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(user);
  return user;
}

export function sanitizeUser(user: StoredUser): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}
