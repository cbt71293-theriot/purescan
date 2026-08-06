<script lang="ts">
  interface Props {
    title: string;
    additives: Array<{ code: string; name: string }>;
    score: number;
    scannedAt: string;
  }

  let { title, additives = [], score, scannedAt }: Props = $props();
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <div class="flex items-start justify-between gap-4">
    <div>
      <h3 class="text-base font-semibold text-slate-900">{title}</h3>
      <p class="mt-1 text-xs text-slate-500">
        Scanned at {new Date(scannedAt).toLocaleString()}
      </p>
    </div>

    <div class="text-right">
      <p class="text-2xl font-bold text-brand-700">{score}</p>
      <p class="text-xs text-slate-500">Score</p>
    </div>
  </div>

  {#if additives.length}
    <ul class="mt-4 flex flex-wrap gap-2">
      {#each additives as additive}
        <li class="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-800">
          {additive.code}
        </li>
      {/each}
    </ul>
  {/if}
</div>
