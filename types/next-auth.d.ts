import "next-auth"; import "next-auth/jwt"; import type { Role } from "@/lib/types";
declare module "next-auth" { interface User { role?:Role; organizationIds?:string[] } interface Session { user: { id:string; role?:Role; organizationIds?:string[] } & DefaultSession["user"] } }
declare module "next-auth/jwt" { interface JWT { role?:Role; organizationIds?:string[] } }
