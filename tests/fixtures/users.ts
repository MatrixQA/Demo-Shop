export interface UserCredentials {
  username: string;
  password: string;
}

export const users: { user: UserCredentials; admin: UserCredentials } = {
  user: { username: 'user', password: 'user123' },
  admin: { username: 'admin', password: 'admin123' },
};
