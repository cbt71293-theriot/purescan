<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";
  import type { PantryItem } from "$lib/types/index.js";

  let items = $state<PantryItem[]>([]);

  onMount(async () => {
    items = await db.pantry.orderBy("expiresAt").toArray();
  });

  async function addItem() {
    const barcode = prompt("Enter barcode");
    if (!barcode) return;

    const product = {
      barcode,
      name: "Demo pantry item",
      brand: undefined,
      ingredients: [],
      additives: [],
      score: 0,
      level: "C",
      category: undefined,
      imageUrl: undefined,
      lastUpdated: Date.now(),
      source: "manual"
    } as any;

    await db.pantry.add({
      id: crypto.randomUUID(),
      barcode,
      product,
      addedAt: Date.now()
    });

    items = await db.pantry.orderBy("expiresAt").toArray();
  }
</script>

<section class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-3xl font-bold tracking-tight text-slate-900">Pantry</h1>
    <button
      class="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      onclick={addItem}
    >
      Add item
    </button>
  </div>

  {#if items.length === 0}
    <p class="text-sm text-slate-500">Pantry is empty.</p>
  {:else}
    <div class="grid grid-cols-2 gap-3">
      {#each items as item}
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="font-medium text-slate-900">{item.product.name}</p>
          <p class="text-xs text-slate-500">Added {new Date(item.addedAt).toLocaleDateString()}</p>
        </div>
      {/each}
    </div>
  {/if}
</section>
