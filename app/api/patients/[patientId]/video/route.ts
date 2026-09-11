import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActor } from "@/lib/session";
import { authorize } from "@/lib/authorization";
import { audit } from "@/lib/audit";
import { connectDb } from "@/lib/db";
import { VideoVisit } from "@/lib/models";

const schema=z.object({startsAt:z.coerce.date(),endsAt:z.coerce.date()}).refine(x=>x.endsAt>x.startsAt,"End must follow start");
export async function GET(_r:Request,{params}:{params:Promise<{patientId:string}>}){try{const actor=await requireActor();const {patientId}=await params;await authorize({actor,action:"VIDEO_VISIT_READ",patientId});await connectDb();const visits=await VideoVisit.find({patientId,$or:[{doctorUserId:actor.userId},{status:{$in:["SCHEDULED","IN_PROGRESS"]}}]}).select("doctorUserId startsAt endsAt status").sort({startsAt:1}).lean();return NextResponse.json({visits});}catch{return NextResponse.json({error:"Forbidden"},{status:403});}}
export async function POST(r:Request,{params}:{params:Promise<{patientId:string}>}){try{const actor=await requireActor();const {patientId}=await params;if(actor.role!=="DOCTOR")return NextResponse.json({error:"Only assigned doctors may schedule video care"},{status:403});const scope=await authorize({actor,action:"VIDEO_VISIT_CREATE",patientId});const input=schema.parse(await r.json());await connectDb();const token=crypto.randomBytes(24).toString("base64url");const hash=crypto.createHash("sha256").update(token).digest("hex");const visit=await VideoVisit.create({patientId,doctorUserId:actor.userId,organizationId:scope.organizationId,startsAt:input.startsAt,endsAt:input.endsAt,roomTokenHash:hash,roomExpiresAt:input.endsAt});await audit({actorId:actor.userId,action:"VIDEO_VISIT_SCHEDULED",patientId,organizationId:scope.organizationId,outcome:"SUCCESS",metadata:{visitId:String(visit._id)}});return NextResponse.json({id:String(visit._id),startsAt:visit.startsAt,endsAt:visit.endsAt,join:"Provider configuration required"},{status:201});}catch{return NextResponse.json({error:"Unable to schedule video visit"},{status:400});}}
