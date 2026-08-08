<script lang="ts">
  import { onMount } from "svelte";
  import { isScanning, scanError, scanResult } from "$lib/stores/scanner.js";
  import { analyzeAdditives } from "$lib/services/additives.js";
  import { computeProductScore } from "$lib/services/scoring.js";
  import { matchProfileRules } from "$lib/services/rules.js";
  import { db } from "$lib/stores/db.js";
  import type { ScanResult } from "$lib/stores/scanner.js";
  import type { Profile } from "$lib/types/index.js";

  let fileInput: HTMLInputElement;
  let scannerContainer: HTMLDivElement;
  let html5Qrcode: any;
  let scanning = false;
  let cameraActive = false;
  let profile: Profile | null = null;
  let ruleMatches: Array<{ ingredient: string; ruleType: string; severity: string }> = [];

  onMount(() => {
    db.profiles.get("default").then((existing) => {
      if (existing) {
        profile = existing;
      }
    });

    return () => {
      if (html5Qrcode && cameraActive) {
        html5Qrcode.stop().catch(() => {});
      }
    };
  });

  async function startCamera() {
    if (!scannerContainer) return;

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      html5Qrcode = new Html5Qrcode(scannerContainer.id);

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5Qrcode.start(
        { facingMode: "environment" },
        config,
        (decodedText: string) => {
          handleBarcodeScanned(decodedText);
        },
        () => {}
      );

      cameraActive = true;
      isScanning.set(true);
      scanError.set(null);
    } catch (err) {
      scanError.set(err instanceof Error ? err.message : "Camera failed to start");
    }
  }

  function stopCamera() {
    if (html5Qrcode && cameraActive) {
      html5Qrcode.stop().then(() => {
        cameraActive = false;
        isScanning.set(false);
      }).catch(() => {
        cameraActive = false;
        isScanning.set(false);
      });
    }
  }

  async function handleBarcodeScanned(barcode: string) {
    if (scanning) return;
    scanning = true;
    isScanning.set(true);
    scanError.set(null);
    scanResult.set(null);
    ruleMatches = [];

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

      if (profile) {
        ruleMatches = matchProfileRules(profile, additives, ingredientsText);
      }

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
      scanning = false;
      isScanning.set(false);
    }
  }

  async function handleFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    scanError.set(null);
    scanResult.set(null);
    ruleMatches = [];

    try {
      const { default: Tesseract } = await import("tesseract.js");
      scanError.set("OCR is initializing...");

      const ocrResult = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            scanError.set(`OCR scanning: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      const text = ocrResult.data.text;
      if (!text.trim()) {
        throw new Error("No text detected in image.");
      }

      const additives = analyzeAdditives(text);
      const scoreResult = computeProductScore(additives);

      if (profile) {
        ruleMatches = matchProfileRules(profile, additives, text);
      }

      const scanResultData: ScanResult = {
        id: crypto.randomUUID(),
        barcode: undefined,
        productName: "OCR Scan Result",
        brand: undefined,
        image: undefined,
        ingredientsText: text,
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

      scanResult.set(scanResultData);

      await db.scans.add({
        scanId: scanResultData.id,
        barcode: scanResultData.barcode,
        productName: scanResultData.productName,
        brand: scanResultData.brand,
        additivesJson: JSON.stringify(additives),
        score: scanResultData.score ?? 0,
        scannedAt: scanResultData.scannedAt,
        syncedAt: undefined
      });
    } catch (err) {
      scanError.set(err instanceof Error ? err.message : "OCR failed");
    } finally {
      input.value = "";
    }
  }
</script>

<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">Scanner</h2>
      <span class="text-xs text-slate-500">Barcode / OCR</span>
    </div>

    {#if $isScanning && !cameraActive}
      <p class="text-sm text-slate-600">Scanning…</p>
    {:else if $scanError && !$scanResult}
      <div class="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
        <span class="mt-0.5 inline-flex h-2 w-2 rounded-full bg-red-600"></span>
        <span>{$scanError}</span>
      </div>
    {:else if $scanResult}
      <div class="space-y-2">
        <p class="text-sm text-slate-700">
          Last scan: {$scanResult.productName ?? $scanResult.barcode}
        </p>
        <p class="text-sm text-slate-700">
          Score: {$scanResult.score} ({$scanResult.level})
        </p>
        <p class="text-xs text-slate-500">{$scanResult.rationale}</p>

        {#if ruleMatches.length}
          <div class="mt-3 space-y-2">
            <p class="text-sm font-medium text-slate-900">Profile rules</p>
            <ul class="space-y-1">
              {#each ruleMatches as match}
                <li class="flex items-center gap-2 text-xs">
                  <span
                    class="inline-flex h-2 w-2 rounded-full {match.severity === 'block'
                      ? 'bg-red-600'
                      : 'bg-amber-600'}"
                  ></span>
                  <span class="font-medium text-slate-900">{match.ingredient}</span>
                  <span class="text-slate-500">{match.ruleType}</span>
                  <span
                    class="rounded-full border px-2 py-0.5 {match.severity === 'block'
                      ? 'border-red-200 text-red-800'
                      : 'border-amber-200 text-amber-800'}"
                  >
                    {match.severity}
                  </span>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>
    {:else}
      <p class="text-sm text-slate-500">Start a scan below.</p>
    {/if}

    <div class="flex flex-col gap-3">
      {#if !cameraActive}
        <button
          class="rounded-lg bg-brand-600 px-4 py-3 text-sm font-medium text-white hover:bg-brand-700"
          onclick={startCamera}
        >
          Start Camera
        </button>
      {:else}
        <button
          class="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onclick={stopCamera}
        >
          Stop Camera
        </button>
      {/if}

      <div
        id="scanner-reader"
        bind:this={scannerContainer}
        class="rounded-lg bg-slate-50"
      ></div>

      <button
        class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        onclick={() => fileInput?.click()}
      >
        Upload ingredients image
      </button>
      <input
        bind:this={fileInput}
        type="file"
        accept="image/*"
        class="hidden"
        onchange={handleFileSelected}
      />
    </div>
  </div>
</div>
