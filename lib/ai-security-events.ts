import "server-only";
import crypto from "crypto";
import { AISecurityEvent } from "@/lib/models";
import { hashAiContent,scanAiContent } from "@/lib/ai-security";
export async function recordAiSecurity(input:{actorId?:string;patientId?:string;organizationId?:string;source:"COMPANION"|"COPILOT"|"OCR"|"VOICE"|"DOCUMENT";content:string;output?:string;tool?:string;toolAllowed?:boolean}){const assessment=scanAiContent(input.content);const correlationId=crypto.randomUUID();await AISecurityEvent.create({...input,decision:assessment.decision,categories:assessment.categories,requestHash:hashAiContent(input.content),outputHash:input.output?hashAiContent(input.output):undefined,correlationId});return {...assessment,correlationId};}
