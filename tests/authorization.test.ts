import { describe,expect,it } from "vitest"; import { ROLES } from "@/lib/types";
describe("identity role contract",()=>{it("has only supported roles",()=>expect(ROLES).toEqual(["PATIENT","GUARDIAN","DOCTOR","HOSPITAL_ADMIN"]));});
