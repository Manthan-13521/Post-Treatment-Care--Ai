import "server-only";
import { auth } from "@/auth"; import type { Actor } from "@/lib/types";
export async function requireActor():Promise<Actor> { const session=await auth(); if(!session?.user?.id||!session.user.role) throw new Error("Unauthenticated"); return {userId:session.user.id,role:session.user.role,organizationIds:session.user.organizationIds??[]}; }
