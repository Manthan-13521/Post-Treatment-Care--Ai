import mongoose from "mongoose";
import * as models from "../lib/models";
const mongoUri=process.env.MONGODB_URI??"";if(!mongoUri)throw new Error("MONGODB_URI is required for index migration.");
async function main(){await mongoose.connect(mongoUri);const collections=Object.entries(models).filter(([,value])=>typeof (value as {syncIndexes?:unknown}).syncIndexes==="function");for(const [name,value] of collections){await (value as {syncIndexes:()=>Promise<unknown>}).syncIndexes();console.log(`indexes synchronized: ${name}`);}await mongoose.disconnect();}
void main().catch(async error=>{console.error(error);await mongoose.disconnect();process.exitCode=1;});
