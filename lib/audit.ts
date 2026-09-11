import "server-only";
import { connectDb } from "@/lib/db"; import { AuditEvent } from "@/lib/models";
export async function audit(event:{actorId?:string;action:string;patientId?:string;organizationId?:string;outcome:"SUCCESS"|"DENIED";metadata?:Record<string,unknown>}) { await connectDb(); await AuditEvent.create(event); }
