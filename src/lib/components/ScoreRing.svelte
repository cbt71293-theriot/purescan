<script lang="ts">
  interface Props {
    score: number;
    level?: string;
  }

  let { score, level }: Props = $props();

  const levelColor: Record<string, string> = {
    A: "text-emerald-600",
    B: "text-lime-600",
    C: "text-amber-600",
    D: "text-orange-600",
    F: "text-red-600"
  };
</script>

<div class="inline-flex flex-col items-center">
  <svg viewBox="0 0 36 36" class="h-24 w-24">
    <circle
      cx="18"
      cy="18"
      r="15.9155"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      class="text-slate-200"
    />
    <circle
      cx="18"
      cy="18"
      r="15.9155"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-dasharray={`${score}, 100`}
      class="text-brand-600"
      transform="rotate(-90 18 18)"
    />
    <text x="18" y="18" text-anchor="middle" class="text-sm font-semibold fill-slate-900">
      {score}
    </text>
  </svg>
  <span class="text-xs text-slate-500">Score</span>
  {#if level}
    <span class="text-lg font-bold {levelColor[level] || 'text-slate-900'}">{level}</span>
  {/if}
</div>
