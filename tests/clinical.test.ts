import { describe,expect,it } from "vitest"; import { appointmentSchema,clinicalProfileSchema,clinicalWriteAllowed,medicationSchema,noteSchema,symptomSchema } from "@/lib/clinical";
describe("clinical validation and permissions",()=>{
 it("accepts a valid medication schedule",()=>expect(medicationSchema.safeParse({name:"A",dose:"5mg",frequency:"daily",schedule:["08:00"]}).success).toBe(true));
 it("rejects invalid medication times",()=>expect(medicationSchema.safeParse({name:"A",dose:"5mg",frequency:"daily",schedule:["30:00"]}).success).toBe(false));
 it("rejects symptom severity outside one to ten",()=>expect(symptomSchema.safeParse({name:"Pain",severity:11,occurredAt:"2026-09-11T10:00:00.000Z"}).success).toBe(false));
 it("requires an appointment end after its start",()=>expect(appointmentSchema.safeParse({doctorUserId:"d",organizationId:"o",startsAt:"2026-09-11T10:00:00.000Z",endsAt:"2026-09-11T09:00:00.000Z",reason:"Review"}).success).toBe(false));
 it("allows only care-team clinical writes",()=>{expect(clinicalWriteAllowed("DOCTOR")).toBe(true);expect(clinicalWriteAllowed("HOSPITAL_ADMIN")).toBe(true);expect(clinicalWriteAllowed("GUARDIAN")).toBe(false);});
 it("limits note visibility values",()=>expect(noteSchema.safeParse({body:"Care update",visibility:"PRIVATE"}).success).toBe(false));
 it("accepts a bounded clinical profile",()=>expect(clinicalProfileSchema.safeParse({bloodType:"O+",emergencyContact:{name:"Ada",phone:"+919876543210",relationship:"Guardian"}}).success).toBe(true));
});
