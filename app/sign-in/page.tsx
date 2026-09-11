import { authConfiguration } from "@/lib/env"; import SignInClient from "./sign-in-client";
export const dynamic="force-dynamic";
export default async function SignInPage({searchParams}:{searchParams:Promise<{error?:string}>}){return <SignInClient auth={authConfiguration()} error={(await searchParams).error}/>}
