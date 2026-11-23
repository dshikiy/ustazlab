import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "../src/lib/rate-limit";
import { aiRequestSchema, getEducationAiProvider } from "../src/lib/ai/provider";
import { kk } from "../src/lib/i18n/kk";
import { ru } from "../src/lib/i18n/ru";

describe("rate-limit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("enforces request limits per key within the time window", () => {
    const r1 = checkRateLimit("login:test@example.kz", 2, 60_000);
    const r2 = checkRateLimit("login:test@example.kz", 2, 60_000);
    const r3 = checkRateLimit("login:test@example.kz", 2, 60_000);

    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(false);
    expect(r3.remaining).toBe(0);
  });
});

describe("ai provider validation", () => {
  it("validates educational AI requests with Zod", () => {
    const valid = aiRequestSchema.safeParse({
      task: "lesson",
      prompt: "3-сыныпқа суды үнемдеу тақырыбында сабақ нобайын дайында",
      grade: 3,
    });
    expect(valid.success).toBe(true);

    const tooShort = aiRequestSchema.safeParse({
      task: "lesson",
      prompt: "short",
    });
    expect(tooShort.success).toBe(false);
  });

  it("returns null when AI credentials are not configured", () => {
    const origUrl = process.env.AI_API_URL;
    const origKey = process.env.AI_API_KEY;
    const origModel = process.env.AI_MODEL;
    delete process.env.AI_API_URL;
    delete process.env.AI_API_KEY;
    delete process.env.AI_MODEL;
    expect(getEducationAiProvider()).toBeNull();
    if (origUrl) process.env.AI_API_URL = origUrl;
    if (origKey) process.env.AI_API_KEY = origKey;
    if (origModel) process.env.AI_MODEL = origModel;
  });
});

describe("i18n parity", () => {
  it("ensures Kazakh and Russian dictionaries have identical top-level and nested keys", () => {
    expect(Object.keys(ru).sort()).toEqual(Object.keys(kk).sort());
    for (const section of Object.keys(kk) as (keyof typeof kk)[]) {
      expect(Object.keys(ru[section]).sort()).toEqual(
        Object.keys(kk[section]).sort()
      );
    }
  });
});
