export const ENROLLMENT_STATUS = {
  ENROLLED: 'ENROLLED',
  CANCELLED: 'CANCELLED',
} as const;

export type EnrollmentStatusType = (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS];
