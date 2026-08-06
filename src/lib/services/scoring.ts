export type ScoreLevel = "A" | "B" | "C" | "D" | "F";

export interface ScoreResult {
  level: ScoreLevel;
  score: number;
  rationale: string;
}

const LEVELS: { level: ScoreLevel; min: number; max: number }[] = [
  { level: "A", min: 85, max: 100 },
  { level: "B", min: 70, max: 84 },
  { level: "C", min: 55, max: 69 },
  { level: "D", min: 40, max: 54 },
  { level: "F", min: 0, max: 39 }
];

export function computeProductScore(additivesCount: number): ScoreResult {
  // Placeholder scoring heuristic.
  const lowerBound = Math.max(0, 100 - additivesCount * 12);
  const score = Math.min(100, Math.max(0, lowerBound));

  const level =
    LEVELS.find((l) => score >= l.min && score <= l.max)?.level ?? "F";

  const rationale =
    additivesCount === 0
      ? "No flagged additives found in this demo scoring model."
      : `${additivesCount} additive(s) detected; score lowered accordingly.`;

  return { level, score, rationale };
}
