<script lang="ts">
  import { db } from "$lib/stores/db.js";
</script>

<section class="space-y-6">
  <h1 class="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>

  <div class="grid gap-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-base font-semibold text-slate-900">Data</h2>
      <p class="mt-1 text-sm text-slate-500">Manage local scan history and pantry data. These actions do not affect your profile.</p>
      <div class="mt-3 flex flex-col gap-2">
        <button
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onclick={async () => {
            if (!confirm("Clear all scan history?")) return;
            await db.scans.clear();
            location.reload();
          }}
        >
          Clear scan history
        </button>
        <button
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          onclick={async () => {
            if (!confirm("Clear pantry items?")) return;
            await db.pantry.clear();
            location.reload();
          }}
        >
          Clear pantry
        </button>
        <button
          class="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
          onclick={async () => {
            if (!confirm("Reset all local data? This cannot be undone.")) return;
            await db.delete();
            location.reload();
          }}
        >
          Reset all data
        </button>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 class="text-base font-semibold text-slate-900">About</h2>
      <p class="mt-1 text-sm text-slate-500">PureScan is a local-first ingredient transparency tool. Scores are educational, not medical advice.</p>
      <p class="mt-2 text-xs text-slate-500">Version 0.1.0</p>
    </div>
  </div>
</section>
