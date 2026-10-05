export type ResourceType =
  | "GENERATOR"
  | "SOLAR_BESS"
  | "BATTERY"
  | "MICROGRID"
  | "OTHER";

export type ProviderStatus =
  | "PENDING_EMAIL_VERIFICATION"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type ProviderRegistrationDetails = {
  companyName: string;
  licenseNumber: string;
  resourceType: ResourceType;
  capacityKw: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  bankAccountNumber?: string;
};

export type ApplyAsProviderPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  provider: ProviderRegistrationDetails;
};

export type ApplyAsProviderResult = {
  emailSent: boolean;
  otp?: string;
};

export type VerifyProviderEmailPayload = {
  email: string;
  otp: string;
};

export type ProviderProfile = {
  id: string;
  userId: string;
  companyName: string;
  licenseNumber: string;
  resourceType: ResourceType;
  capacityKw: number;
  address: string;
  contactPerson: string;
  contactPhone: string;
  bankAccountNumber: string | null;
  status: ProviderStatus;
  rejectionReason: string | null;
  verified: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type VerifyProviderEmailResult = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "PROVIDER";
    emailVerified: boolean;
    status: string;
  };
  provider: ProviderProfile;
};
