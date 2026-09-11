import crypto from "crypto";
export function normalizeE164(phone:string) { const digits=phone.replace(/[\s().-]/g,""); if(!/^\+[1-9]\d{7,14}$/.test(digits)) throw new Error("Phone number must be in E.164 format."); return digits; }
export function otpHash(code:string) { return crypto.createHash("sha256").update(`${code}:${process.env.AUTH_SECRET ?? "development-only-secret"}`).digest("hex"); }
export function newOtp() { return crypto.randomInt(0,1_000_000).toString().padStart(6,"0"); }
