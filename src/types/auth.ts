export type UserRole = "CONSUMER" | "PROVIDER" | "OPERATOR" | "ADMIN";

export type UserStatus = "ACTIVE" | "BLOCKED" | "DELETED";

export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ConsumerRegistrationDetails = {
  contactPhone?: string;
  organizationName?: string;
  criticalLoadKw?: number;
  address?: string;
  contactPerson?: string;
};

export type RegisterConsumerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  consumer?: ConsumerRegistrationDetails;
};

export type RegisterConsumerResult = {
  emailSent: boolean;
  otp?: string;
};

export type VerifyEmailPayload = {
  email: string;
  otp: string;
};

export type ConsumerProfile = {
  id: string;
  userId: string;
  organizationName: string;
  criticalLoadKw: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  googleId: string | null;
  authProvider: AuthProvider;
  role: UserRole;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  isActive: boolean;
  imageUrl: string | null;
  image_public_id: string | null;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  status: UserStatus;
  consumer: ConsumerProfile | null;
};

export type VerifyEmailResult = AuthTokens & {
  user: Omit<User, "consumer">;
  consumer: ConsumerProfile | null;
};

export type GoogleLoginPayload = {
  idToken: string;
};
