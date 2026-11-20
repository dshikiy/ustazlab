import { SignJWT,jwtVerify } from "jose"; import { cookies } from "next/headers"; import { redirect } from "next/navigation";
export type Session={id:string;name:string;email:string;role:"ADMIN"|"TEACHER"};
const key=()=>new TextEncoder().encode(process.env.AUTH_SECRET||"development-only-secret");
export async function createSession(user:Session){const token=await new SignJWT(user).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key());(await cookies()).set("ustaz_session",token,{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:604800})}
export async function getSession():Promise<Session|null>{const token=(await cookies()).get("ustaz_session")?.value;if(!token)return null;try{return (await jwtVerify(token,key())).payload as unknown as Session}catch{return null}}
export async function requireUser(){const s=await getSession();if(!s)redirect("/login");return s}
export async function requireAdmin(){const s=await requireUser();if(s.role!=="ADMIN")redirect("/dashboard");return s}
