<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";

  let scans = $state<Array<{
    scanId: string;
    barcode?: string;
    productName?: string;
    brand?: string;
    additivesJson: string;
    score: number;
    scannedAt: string;
    syncedAt?: string;
  }>>([]);

  onMount(async () => {
    scans = await db.scans.orderBy("scannedAt").reverse().limit(50).toArray();
  });
</script>

<section class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Scan History</h1>
  </div>

  {#if scans.length === 0}
    <p class="text-sm text-slate-500">No scans yet.</p>
  {:else}
    <div class="space-y-3">
      {#each scans as scan}
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-900">{scan.productName ?? scan.barcode ?? "Unknown"}</p>
              <p class="text-xs text-slate-500">
                {new Date(scan.scannedAt).toLocaleString()}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-brand-700">{scan.score}</p>
              <p class="text-xs text-slate-500">Score</p>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
