import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectDb } from "@/lib/db";
import { User } from "@/lib/models";
import { ROLES, type Role } from "@/lib/types";
const demoEnabled=process.env.CARESHIELD_DEMO_MODE==="true" && process.env.NODE_ENV!=="production";
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session:{strategy:"jwt",maxAge:60*60*8},
  providers:[
    Google({allowDangerousEmailAccountLinking:false}),
    Credentials({id:"demo",name:"Demo",credentials:{role:{}},authorize:async(c)=>{
      if(!demoEnabled) return null; const role=c?.role as Role; if(!ROLES.includes(role)) return null;
      await connectDb(); const email=`demo.${role.toLowerCase()}@careshield.invalid`; const user=await User.findOneAndUpdate({email},{email,name:`Demo ${role.replace("_"," ")}`,role,accountState:"ACTIVE",onboardingComplete:true,organizationIds:[]},{upsert:true,new:true,setDefaultsOnInsert:true});
      return {id:String(user._id),email:user.email,name:user.name,image:null,role:user.role,organizationIds:user.organizationIds};
    }})
  ],
  callbacks:{
    async signIn({account,profile}) { if(account?.provider!=="google" || !profile?.email) return true; await connectDb(); await User.findOneAndUpdate({email:profile.email.toLowerCase()},{email:profile.email.toLowerCase(),googleId:account.providerAccountId,name:profile.name,image:profile.picture,role:"PATIENT",accountState:"ACTIVE",organizationIds:[]},{upsert:true,new:true,setDefaultsOnInsert:true}); return true; },
    async jwt({token,user}) { if(user?.id) { await connectDb(); const dbUser=await User.findById(user.id).lean() as {_id:unknown;accountState:"ACTIVE"|"SUSPENDED";role:Role;organizationIds:string[]}|null; if(!dbUser || dbUser.accountState!=="ACTIVE") return {}; token.sub=String(dbUser._id); token.role=dbUser.role; token.organizationIds=dbUser.organizationIds.map(String); } return token; },
    async session({session,token}) { if(token.sub&&session.user){session.user.id=token.sub;session.user.role=token.role as Role;session.user.organizationIds=(token.organizationIds as string[])??[];} return session; }
  },
  pages:{signIn:"/sign-in"}
});
