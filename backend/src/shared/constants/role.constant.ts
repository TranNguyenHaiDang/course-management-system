export const ROLE = {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
} as const;

export type RoleType = (typeof ROLE)[keyof typeof ROLE];
