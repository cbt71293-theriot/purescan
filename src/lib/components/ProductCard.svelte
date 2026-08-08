<script lang="ts">
  import ScoreRing from "./ScoreRing.svelte";

  interface Props {
    title: string;
    brand?: string;
    image?: string;
    additives: Array<{ code: string; name: string; riskLevel: string; description: string }>;
    score: number;
    level?: string;
    rationale?: string;
    scannedAt: string;
  }

  let { title, brand, image, additives = [], score, level, rationale, scannedAt }: Props = $props();

  const riskColor: Record<string, string> = {
    low: "bg-emerald-50 text-emerald-800 border-emerald-200",
    medium: "bg-amber-50 text-amber-800 border-amber-200",
    high: "bg-red-50 text-red-800 border-red-200",
    unknown: "bg-slate-50 text-slate-800 border-slate-200"
  };
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="flex items-start gap-4">
    {#if image}
      <img src={image} alt={title} class="h-16 w-16 rounded-xl object-cover" />
    {/if}

    <div class="flex-1">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-slate-900">{title}</h3>
          {#if brand}
            <p class="text-xs text-slate-500">{brand}</p>
          {/if}
          <p class="mt-1 text-xs text-slate-500">
            Scanned {new Date(scannedAt).toLocaleString()}
          </p>
        </div>

        <ScoreRing {score} {level} />
      </div>

      {#if additives.length}
        <div class="mt-3 flex flex-wrap gap-2">
          {#each additives as additive}
            <span class="rounded-full border px-2.5 py-1 text-xs font-medium {riskColor[additive.riskLevel] || riskColor.unknown}">
              {additive.code}
            </span>
          {/each}
        </div>
      {/if}

      {#if rationale}
        <p class="mt-2 text-xs text-slate-500">{rationale}</p>
      {/if}
    </div>
  </div>
</div>
