<script lang="ts">
  interface Props {
    score: number;
  }

  let { score }: Props = $props();
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
    <text x="18" y="20" text-anchor="middle" class="text-sm font-semibold fill-slate-900">
      {score}
    </text>
  </svg>
  <span class="text-xs text-slate-500">Purity score</span>
</div>
