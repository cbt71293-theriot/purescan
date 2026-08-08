<script lang="ts">
  import Scanner from "$lib/components/Scanner.svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import type { ScanResult } from "$lib/stores/scanner.js";
  import { scanResult } from "$lib/stores/scanner.js";

  let recentScans: ScanResult[] = $state([]);

  scanResult.subscribe((value) => {
    if (value) {
      recentScans = [value, ...recentScans].slice(0, 10);
    }
  });
</script>

<svelte:head>
  <title>Scan — PureScan</title>
</svelte:head>

<section class="space-y-6">
  <div class="text-center">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Scan</h1>
    <p class="mt-2 text-slate-600">Use your camera or upload an ingredients image to analyze a product.</p>
  </div>

  <Scanner />

  <div class="mt-10 space-y-4">
    <h2 class="text-xl font-semibold">Recent scans</h2>
    {#if recentScans.length === 0}
      <p class="text-sm text-slate-500">No scans yet. Try the scanner above.</p>
    {:else}
      <div class="space-y-3">
        {#each recentScans as item}
          <ProductCard
            title={item.productName ?? item.barcode ?? "Unknown product"}
            brand={item.brand}
            image={item.image}
            additives={(item.additives ?? []).map((a) => ({
              code: a.code,
              name: a.name,
              riskLevel: a.riskLevel,
              description: a.description
            }))}
            score={item.score ?? 0}
            level={item.level}
            rationale={item.rationale}
            scannedAt={item.scannedAt}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>
