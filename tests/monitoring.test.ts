import { describe,expect,it } from "vitest"; import { assessVitals,computeBaseline,deviceSecret,deviceSecretHash,nextShadow,priority,telemetrySchema } from "@/lib/monitoring";
describe("monitoring engine",()=>{
 it("calculates a personalized baseline",()=>expect(computeBaseline([70,72,74])).toMatchObject({mean:72,sampleCount:3}));
 it("rejects empty baseline input",()=>expect(()=>computeBaseline([])).toThrow());
 it("marks low-quality-only data as sensor failure",()=>expect(assessVitals([{metric:"SPO2",value:98,quality:.2}]).sensorFailure).toBe(true));
 it("detects critical oxygen deterioration",()=>{const a=assessVitals([{metric:"SPO2",value:88,quality:1}]);expect(a.riskScore).toBeGreaterThanOrEqual(50);expect(nextShadow(null,a).state).toBe("DETERIORATING");});
 it("detects critical heart-rate deterioration",()=>expect(assessVitals([{metric:"HEART_RATE",value:140,quality:1}]).riskScore).toBeGreaterThanOrEqual(50));
 it("detects elevated temperature",()=>expect(assessVitals([{metric:"TEMPERATURE",value:39.2,quality:1}]).riskScore).toBeGreaterThanOrEqual(50));
 it("adds risk for a three-standard-deviation personal deviation",()=>expect(assessVitals([{metric:"HEART_RATE",value:100,quality:1}],{HEART_RATE:{mean:70,standardDeviation:5}}).riskScore).toBeGreaterThan(0));
 it("moves from deterioration to recovery after safe vitals",()=>expect(nextShadow({state:"DETERIORATING",stableStreak:0},{riskScore:0,reasons:[],sensorFailure:false}).state).toBe("RECOVERY"));
 it("requires sustained recovery before normal",()=>{const safe={riskScore:0,reasons:[],sensorFailure:false};expect(nextShadow({state:"RECOVERY",stableStreak:1},safe).state).toBe("RECOVERY");expect(nextShadow({state:"RECOVERY",stableStreak:2},safe).state).toBe("NORMAL");});
 it("resets only through explicit reset control",()=>expect(nextShadow({state:"DETERIORATING",stableStreak:0},{riskScore:90,reasons:["x"],sensorFailure:false},true).state).toBe("RESET"));
 it("prioritizes deterioration above sensor failure and normal",()=>expect(priority({state:"DETERIORATING",riskScore:50})).toBeGreaterThan(priority({state:"SENSOR_FAILURE",riskScore:100})));
 it("hashes device secrets",()=>{const secret=deviceSecret();expect(secret.length).toBeGreaterThan(30);expect(deviceSecretHash(secret)).not.toContain(secret);});
 it("validates telemetry bounds and timestamp",()=>expect(telemetrySchema.safeParse({metric:"SPO2",value:98,quality:1,occurredAt:"2026-09-11T00:00:00.000Z"}).success).toBe(true));
 it("rejects telemetry quality above one",()=>expect(telemetrySchema.safeParse({metric:"SPO2",value:98,quality:1.1,occurredAt:"2026-09-11T00:00:00.000Z"}).success).toBe(false));
});
