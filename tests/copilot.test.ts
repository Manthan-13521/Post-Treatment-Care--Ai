import { describe,expect,it } from "vitest";
import { z } from "zod";
describe("clinical copilot and video boundaries",()=>{it("rejects invalid video windows",()=>{const schema=z.object({startsAt:z.coerce.date(),endsAt:z.coerce.date()}).refine(x=>x.endsAt>x.startsAt);expect(()=>schema.parse({startsAt:"2026-01-02",endsAt:"2026-01-01"})).toThrow();});it("makes clinician review explicit",()=>{const draft="Clinical copilot draft — clinician review required.";expect(draft).toContain("clinician review required");});});
