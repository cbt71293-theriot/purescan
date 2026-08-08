<script lang="ts">
  import { onMount } from "svelte";
  import { db } from "$lib/stores/db.js";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import type { ScanResult } from "$lib/stores/scanner.js";

  let recentScans = $state<(ScanResult & { scanId: string })[]>([]);

  onMount(async () => {
    const rows = await db.scans.orderBy("scannedAt").reverse().limit(10).toArray();
    recentScans = rows
      .map((row) => {
        let additives: ScanResult["additives"] = [];
        try {
          additives = JSON.parse(row.additivesJson || "[]");
        } catch {
          // ignore parse errors
        }
        return {
          id: row.scanId,
          scanId: row.scanId,
          barcode: row.barcode,
          productName: row.productName,
          brand: row.brand,
          image: undefined,
          ingredientsText: undefined,
          additives,
          score: row.score,
          level: undefined,
          rationale: undefined,
          scannedAt: row.scannedAt
        };
      });
  });
</script>

<svelte:head>
  <title>PureScan</title>
</svelte:head>

<section class="space-y-6">
  <div class="text-center">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Scan your food. Understand additives.</h1>
    <p class="mt-2 text-slate-600">Start with the scanner, then review your recent results below.</p>
    <a href="/scan" class="mt-4 inline-block rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:bg-brand-700">Go to scanner</a>
  </div>

  <div class="mt-10 space-y-4">
    <h2 class="text-xl font-semibold">Recent scans</h2>
    {#if recentScans.length === 0}
      <p class="text-sm text-slate-500">No scans yet. Try the scanner.</p>
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
