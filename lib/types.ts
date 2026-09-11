export const ROLES = ["PATIENT", "GUARDIAN", "DOCTOR", "HOSPITAL_ADMIN"] as const;
export type Role = (typeof ROLES)[number];
export type Actor = { userId: string; role: Role; organizationIds: string[] };
