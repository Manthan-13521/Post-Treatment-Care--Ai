import { ackDeadlineMs } from "@/lib/emergency";
export function shouldEscalate(incident:{state:string;createdAt:Date;acknowledgedAt?:Date},now=Date.now()){return incident.state==="OPEN"&&!incident.acknowledgedAt&&now-incident.createdAt.getTime()>=ackDeadlineMs;}
