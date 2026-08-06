import { describe, it, expect } from "vitest";
import { computeProductScore } from "$lib/services/scoring.js";
import { analyzeAdditives } from "$lib/services/additives.js";

describe("scoring", () => {
  it("returns A when no additives are present", () => {
    const result = computeProductScore([]);
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.level).toBe("A");
  });

  it("lowers score with high-risk additives", () => {
    const result = computeProductScore([{ code: "E129" }]);
    expect(result.score).toBeLessThan(85);
    expect(result.breakdown[0].risk).toBe("high");
  });
});

describe("additives", () => {
  it("parses E-codes from ingredient text", () => {
    const result = analyzeAdditives("Contains E621 and E102.");
    expect(result.map((item) => item.code)).toEqual(["E621", "E102"]);
  });

  it("returns empty list when no E-codes are found", () => {
    const result = analyzeAdditives("Tomatoes, water, salt.");
    expect(result).toEqual([]);
  });
});
