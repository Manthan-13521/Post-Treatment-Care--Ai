import { z } from "zod";
export const clinicalProfileSchema=z.object({bloodType:z.string().max(8).optional(),dateOfBirth:z.string().datetime().optional(),sex:z.string().max(32).optional(),emergencyContact:z.object({name:z.string().min(2).max(100),phone:z.string().min(8).max(20),relationship:z.string().min(2).max(50)}).optional()});
export const medicationSchema=z.object({name:z.string().min(1).max(120),dose:z.string().min(1).max(120),frequency:z.string().min(1).max(120),schedule:z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)).min(1).max(8)});
export const symptomSchema=z.object({name:z.string().min(1).max(120),severity:z.number().int().min(1).max(10),occurredAt:z.string().datetime(),notes:z.string().max(2000).optional()});
export const appointmentSchema=z.object({doctorUserId:z.string().min(1),organizationId:z.string().min(1),startsAt:z.string().datetime(),endsAt:z.string().datetime(),reason:z.string().min(3).max(1000)}).refine(x=>new Date(x.endsAt)>new Date(x.startsAt),{message:"Appointment end must follow start"});
export const noteSchema=z.object({body:z.string().min(1).max(10000),visibility:z.enum(["CARE_TEAM","PATIENT_VISIBLE"]).default("CARE_TEAM")});
export function clinicalWriteAllowed(role:string){return role==="DOCTOR"||role==="HOSPITAL_ADMIN";}
