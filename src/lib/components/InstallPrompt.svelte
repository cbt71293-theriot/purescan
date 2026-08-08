<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";

  let deferredPrompt: any = null;
  let installable = $state(false);
  let installHidden = $state(false);

  onMount(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event;
      installable = true;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  });

  async function install() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === "accepted") {
      installHidden = true;
    }
    deferredPrompt = null;
    installable = false;
  }
</script>

{#if installable && !installHidden}
  <div class="fixed inset-x-0 bottom-0 z-50 p-4 md:bottom-6">
    <div class="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-lg backdrop-blur">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-slate-900">Install PureScan</p>
          <p class="text-xs text-slate-500">Add it to your home screen for faster scanning and offline access.</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onclick={() => installHidden = true}
          >
            Not now
          </button>
          <button
            class="rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700"
            onclick={install}
          >
            Install
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
