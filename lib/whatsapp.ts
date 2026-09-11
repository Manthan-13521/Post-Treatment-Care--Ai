import "server-only"; import { sendMetaWhatsAppTemplate } from "@/lib/notifications/meta"; import { emergencyWhatsAppProviderMode } from "@/lib/env";
export interface WhatsAppProvider{readonly name:string;send(input:{recipient:string;incidentId:string}):Promise<{reference:string}>}
export const demoWhatsAppProvider:WhatsAppProvider={name:"DemoWhatsAppProvider",async send(x){return {reference:`DEMO-WA-${x.incidentId.slice(-8)}`}}};
export const metaWhatsAppProvider:WhatsAppProvider={name:"MetaWhatsAppProvider",async send(input){return sendMetaWhatsAppTemplate({to:input.recipient,template:process.env.WHATSAPP_EMERGENCY_TEMPLATE||"careshield_emergency"});}};
const unavailableWhatsAppProvider:WhatsAppProvider={name:"UnavailableWhatsAppProvider",async send(){throw new Error("WhatsApp outbound delivery is unavailable in this environment.")}};
export function emergencyWhatsAppProvider(){const mode=emergencyWhatsAppProviderMode();return mode==="live"?metaWhatsAppProvider:mode==="demo"?demoWhatsAppProvider:unavailableWhatsAppProvider;}
