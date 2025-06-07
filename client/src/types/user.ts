export type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
  lastLogin: Date | null;
};

export type RegisterPayload = Pick<User, 'name' | 'email'> & {
  password: string;
};

export type LoginPayload = Pick<User, 'email'> & {
  password: string;
};
