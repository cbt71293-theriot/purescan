<script lang="ts">
  import "../app.css";
</script>

<svelte:head>
  <title>PureScan</title>
  <meta name="description" content="Scan, analyze, and understand the additives in your food." />
</svelte:head>

<div class="min-h-screen">
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="container flex items-center justify-between py-4">
      <a href="/" class="text-lg font-semibold tracking-tight text-brand-700">
        PureScan
      </a>
      <nav class="flex items-center gap-4 text-sm text-slate-600">
        <a href="/scan" class="hover:text-brand-600">Scan</a>
        <a href="/history" class="hover:text-brand-600">History</a>
        <a href="/about" class="hover:text-brand-600">About</a>
      </nav>
    </div>
  </header>

  <main class="container py-8">
    <slot />
  </main>

  <footer class="border-t border-slate-200">
    <div class="container py-6 text-center text-xs text-slate-500">
      PureScan — educational use only. Not medical advice.
    </div>
  </footer>
</div>
