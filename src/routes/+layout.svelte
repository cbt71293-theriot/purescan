<script lang="ts">
  import "../app.css";
</script>

<svelte:head>
  <title>PureScan</title>
  <meta name="description" content="Scan, analyze, and understand the additives in your food." />
  <meta name="theme-color" content="#22c55e" />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <header class="border-b border-slate-200 bg-white/80 backdrop-blur">
    <div class="container flex items-center justify-between py-4">
      <a href="/" class="text-lg font-semibold tracking-tight text-brand-700">PureScan</a>
      <nav class="hidden items-center gap-4 text-sm text-slate-600 md:flex">
        <a href="/scan" class="hover:text-brand-600">Scan</a>
        <a href="/history" class="hover:text-brand-600">History</a>
        <a href="/pantry" class="hover:text-brand-600">Pantry</a>
        <a href="/profile" class="hover:text-brand-600">Profile</a>
      </nav>
    </div>
  </header>

  <main class="container flex-1 py-8 pb-24 md:py-8">
    <slot />
  </main>

  <nav class="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur md:hidden">
    <div class="container flex items-center justify-around py-2">
      <a href="/scan" class="flex flex-col items-center gap-1 text-xs text-slate-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Scan
      </a>
      <a href="/history" class="flex flex-col items-center gap-1 text-xs text-slate-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        History
      </a>
      <a href="/pantry" class="flex flex-col items-center gap-1 text-xs text-slate-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        Pantry
      </a>
      <a href="/profile" class="flex flex-col items-center gap-1 text-xs text-slate-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile
      </a>
    </div>
  </nav>

  <footer class="border-t border-slate-200">
    <div class="container py-6 text-center text-xs text-slate-500">
      PureScan — educational use only. Not medical advice.
    </div>
  </footer>
</div>
