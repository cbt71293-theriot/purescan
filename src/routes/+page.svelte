<script lang="ts">
  import Scanner from "$lib/components/Scanner.svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
</script>

<svelte:head>
  <title>PureScan</title>
</svelte:head>

<section class="space-y-6">
  <div class="text-center">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">
      Scan your food. Understand additives.
    </h1>
    <p class="mt-2 text-slate-600">
      Point your camera at a barcode or upload an ingredients image to get a plain-language safety and health analysis.
    </p>
  </div>

  <Scanner />

  <div class="mt-10 space-y-4">
    <h2 class="text-xl font-semibold">Recent scans</h2>
    <ProductCard
      title="Example Product"
      additives={[]}
      score={0}
      scannedAt={new Date().toISOString()}
    />
  </div>
</section>
