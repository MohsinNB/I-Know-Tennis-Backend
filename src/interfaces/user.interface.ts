export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;
  agreedToTerms: boolean;
  emailOtp?: string;
  emailOtpExpiresAt?: Date;
  isEmailVerified?: boolean;
}
