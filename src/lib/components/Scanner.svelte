<script lang="ts">
  import { onMount } from "svelte";
  import { isScanning, scanError, scanResult } from "$lib/stores/scanner.js";
  import { analyzeAdditives } from "$lib/services/additives.js";
  import { computeProductScore } from "$lib/services/scoring.js";
  import { db } from "$lib/stores/db.js";
  import type { ScanResult } from "$lib/stores/scanner.js";

  let fileInput: HTMLInputElement;
  let scanning = false;

  onMount(() => {
    return () => {
      if (scanning) {
        isScanning.set(false);
      }
    };
  });

  async function handleBarcodeScanned(barcode: string) {
    isScanning.set(true);
    scanError.set(null);
    scanResult.set(null);

    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      if (!response.ok) {
        throw new Error(`Product lookup failed: ${response.status}`);
      }
      const payload = await response.json();
      const product = payload.product;

      if (!product) {
        throw new Error("No product found for that barcode.");
      }

      const ingredientsText = product.ingredients_text ?? product.ingredients_text_en ?? "";
      const additives = analyzeAdditives(ingredientsText);
      const scoreResult = computeProductScore(additives);

      const result: ScanResult = {
        id: crypto.randomUUID(),
        barcode,
        productName: product.product_name ?? "Unknown product",
        brand: product.brands ?? undefined,
        image: product.image_front_small_url ?? undefined,
        ingredientsText,
        additives: additives.map((a) => ({
          code: a.code,
          name: a.name,
          riskLevel: a.riskLevel === "unknown" ? "medium" : a.riskLevel,
          description: a.description
        })),
        score: scoreResult.score,
        level: scoreResult.level,
        rationale: scoreResult.rationale,
        scannedAt: new Date().toISOString()
      };

      scanResult.set(result);

      await db.scans.add({
        scanId: result.id,
        barcode: result.barcode,
        productName: result.productName,
        brand: result.brand,
        additivesJson: JSON.stringify(additives),
        score: result.score ?? 0,
        scannedAt: result.scannedAt,
        syncedAt: undefined
      });
    } catch (err) {
      scanError.set(err instanceof Error ? err.message : "Scan failed");
    } finally {
      isScanning.set(false);
    }
  }

  async function handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    scanError.set(null);
    scanResult.set(null);

    try {
      scanError.set("OCR upload is not implemented yet.");
    } catch (err) {
      scanError.set(err instanceof Error ? err.message : "Upload failed");
    } finally {
      input.value = "";
    }
  }
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Scanner</h2>
      <span class="text-xs text-slate-500">Barcode demo / image upload</span>
    </div>

    {#if $isScanning}
      <p class="text-sm text-slate-600">Scanning…</p>
    {:else if $scanError}
      <p class="text-sm text-red-600">{$scanError}</p>
    {:else if $scanResult}
      <div class="space-y-2">
        <p class="text-sm text-slate-700">
          Last scan: {$scanResult.productName ?? $scanResult.barcode}
        </p>
        <p class="text-sm text-slate-700">
          Score: {$scanResult.score} ({$scanResult.level})
        </p>
        <p class="text-xs text-slate-500">{$scanResult.rationale}</p>
      </div>
    {:else}
      <p class="text-sm text-slate-500">No active scan.</p>
    {/if}

    <div class="flex flex-wrap gap-2">
      <button
        class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        on:click={() => handleBarcodeScanned("3017760000123")}
      >
        Demo barcode
      </button>
      <button
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        on:click={() => fileInput?.click()}
      >
        Upload ingredients
      </button>
      <input
        bind:this={fileInput}
        type="file"
        accept="image/*"
        class="hidden"
        on:change={handleFileSelected}
      />
    </div>
  </div>
</div>
