import type { Profile } from "$lib/stores/db.js";
import type { RuleMatch } from "$lib/stores/scanner.js";

export function matchProfileRules(
  profile: Profile,
  additives: Array<{ code?: string; name?: string; description?: string }>,
  ingredientsText?: string
): RuleMatch[] {
  const matches: RuleMatch[] = [];
  const text = [ingredientsText, ...additives.map((a) => [a.code, a.name, a.description].join(" "))]
    .join(" ")
    .toLowerCase();

  for (const allergy of profile.allergies) {
    if (!allergy.trim()) continue;
    if (text.includes(allergy.toLowerCase())) {
      matches.push({
        ingredient: allergy,
        ruleType: "allergy",
        profileName: profile.name,
        severity: "block"
      });
    }
  }

  for (const redLine of profile.redLines) {
    if (!redLine.trim()) continue;
    if (text.includes(redLine.toLowerCase())) {
      matches.push({
        ingredient: redLine,
        ruleType: "redLine",
        profileName: profile.name,
        severity: "warn"
      });
    }
  }

  return matches;
}
