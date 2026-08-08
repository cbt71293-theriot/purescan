import { describe, it, expect } from "vitest";
import { matchProfileRules } from "$lib/services/rules.js";

describe("matchProfileRules", () => {
  it("returns matches for allergies", () => {
    const profile = {
      id: "default",
      name: "Test",
      diets: [],
      allergies: ["peanuts"],
      redLines: [],
      goals: [],
      healthDataEnabled: false,
      createdAt: 0,
      updatedAt: 0
    } as any;

    const additives = [{ code: "E621", name: "MSG", description: "Flavor enhancer" }];
    const matches = matchProfileRules(profile, additives, "Contains peanuts and MSG.");

    expect(matches).toHaveLength(1);
    expect(matches[0].ingredient).toBe("peanuts");
    expect(matches[0].ruleType).toBe("allergy");
    expect(matches[0].severity).toBe("block");
  });

  it("returns matches for red lines", () => {
    const profile = {
      id: "default",
      name: "Test",
      diets: [],
      allergies: [],
      redLines: ["red 40"],
      goals: [],
      healthDataEnabled: false,
      createdAt: 0,
      updatedAt: 0
    } as any;

    const additives = [{ code: "E129", name: "Allura Red", description: "Color" }];
    const matches = matchProfileRules(profile, additives, "Colored with Red 40.");

    expect(matches).toHaveLength(1);
    expect(matches[0].ingredient).toBe("red 40");
    expect(matches[0].ruleType).toBe("redLine");
    expect(matches[0].severity).toBe("warn");
  });

  it("returns empty array when no rules match", () => {
    const profile = {
      id: "default",
      name: "Test",
      diets: [],
      allergies: ["dairy"],
      redLines: ["hfcs"],
      goals: [],
      healthDataEnabled: false,
      createdAt: 0,
      updatedAt: 0
    } as any;

    const additives = [{ code: "E621", name: "MSG", description: "Flavor enhancer" }];
    const matches = matchProfileRules(profile, additives, "Just MSG.");

    expect(matches).toHaveLength(0);
  });
});
