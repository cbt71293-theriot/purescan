<script lang="ts">
  import { isScanning, scanError, scanResult, type ScanResult } from "$lib/stores/scanner.js";
  // Placeholder imports; wire real logic later.
  // import { Html5QrcodeScanner } from "html5-qrcode";
  // import { analyzeAdditives } from "$lib/services/additives.js";
  // import { computeProductScore } from "$lib/services/scoring.js";

  function handleBarcodeScanned(barcode: string) {
    // Fetch product from OpenFoodFacts and update store.
    console.log("Scanned barcode:", barcode);
  }
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Scanner</h2>
      <span class="text-xs text-slate-500">Camera / upload placeholder</span>
    </div>

    {#if $isScanning}
      <p class="text-sm text-slate-600">Scanning…</p>
    {:else if $scanError}
      <p class="text-sm text-red-600">{$scanError}</p>
    {:else if $scanResult}
      <p class="text-sm text-slate-700">
        Last scan: {$scanResult.productName ?? $scanResult.barcode}
      </p>
    {:else}
      <p class="text-sm text-slate-500">No active scan.</p>
    {/if}

    <div class="flex flex-wrap gap-2">
      <button
        class="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
        on:click={() => handleBarcodeScanned("demo-barcode")}
      >
        Demo barcode
      </button>
    </div>
  </div>
</div>
