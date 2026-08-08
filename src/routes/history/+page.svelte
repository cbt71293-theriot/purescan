<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";

  let scans = $state<Array<{
    id?: number;
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

  async function removeScan(scanId: string) {
    await db.scans.where("scanId").equals(scanId).delete();
    scans = await db.scans.orderBy("scannedAt").reverse().limit(50).toArray();
  }
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
        {@const additives = (() => {
          try {
            return JSON.parse(scan.additivesJson || "[]");
          } catch {
            return [];
          }
        })()}
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <ProductCard
              title={scan.productName ?? scan.barcode ?? "Unknown"}
              brand={scan.brand}
              additives={additives.map((a: any) => ({
                code: a.code,
                name: a.name,
                riskLevel: a.riskLevel,
                description: a.description
              }))}
              score={scan.score}
              scannedAt={scan.scannedAt}
            />
          </div>
          <button
            class="text-xs text-red-600 hover:text-red-700"
            onclick={() => removeScan(scan.scanId)}
          >
            Remove
          </button>
        </div>
      {/each}
    </div>
  {/if}
</section>
