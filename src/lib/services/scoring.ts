export type ScoreLevel = "A" | "B" | "C" | "D" | "F";

export interface ScoreResult {
  level: ScoreLevel;
  score: number;
  rationale: string;
  breakdown: Array<{
    ingredient: string;
    risk: "low" | "medium" | "high" | "unknown";
    weight: number;
  }>;
}

const LEVELS: { level: ScoreLevel; min: number; max: number }[] = [
  { level: "A", min: 85, max: 100 },
  { level: "B", min: 70, max: 84 },
  { level: "C", min: 55, max: 69 },
  { level: "D", min: 40, max: 54 },
  { level: "F", min: 0, max: 39 }
];

const RISK_PENALTY: Record<string, number> = {
  low: 5,
  medium: 10,
  high: 20,
  unknown: 10
};

const ADDITIVE_WEIGHTS: Record<string, number> = {
  E621: 6,
  E102: 7,
  E110: 7,
  E129: 8,
  E133: 5,
  E250: 7,
  E220: 6,
  E407: 4
};

export function computeProductScore(additives: Array<{ code?: string }>): ScoreResult {
  let penalty = 0;
  const breakdown: ScoreResult["breakdown"] = additives.map((item) => {
    const upperCode = item.code?.toUpperCase();
    const weight = upperCode ? ADDITIVE_WEIGHTS[upperCode] ?? 3 : 3;
    const risk: ScoreResult["breakdown"][number]["risk"] =
      weight >= 7 ? "high" : weight >= 5 ? "medium" : "low";
    penalty += RISK_PENALTY[risk];
    return {
      ingredient: item.code ?? "Unknown additive",
      risk,
      weight
    };
  });

  const score = Math.min(100, Math.max(0, 100 - penalty));
  const level = LEVELS.find((l) => score >= l.min && score <= l.max)?.level ?? "F";
  const rationale =
    additives.length === 0
      ? "No flagged additives found in this demo scoring model."
      : `${additives.length} additive(s) detected; score lowered accordingly.`;

  return { level, score, rationale, breakdown };
}
