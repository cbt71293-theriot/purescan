<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";
  import type { PantryItem } from "$lib/types/index.js";

  let items = $state<(PantryItem & { id: string })[]>([]);

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

    const id = crypto.randomUUID();
    await db.pantry.add({
      id,
      barcode,
      product,
      addedAt: Date.now()
    });

    items = await db.pantry.orderBy("expiresAt").toArray();
  }

  async function removeItem(id: string) {
    await db.pantry.delete(id);
    items = await db.pantry.orderBy("expiresAt").toArray();
  }

  function getExpiryStatus(item: PantryItem & { id: string }) {
    if (!item.expiresAt) return { text: "No expiry", class: "text-slate-500" };
    const now = Date.now();
    const diff = item.expiresAt - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diff < 0) return { text: `Expired ${Math.abs(days)} days ago`, class: "text-red-600 font-medium" };
    if (days <= 7) return { text: `Expires in ${days} days`, class: "text-red-600 font-medium" };
    if (days <= 30) return { text: `Expires in ${days} days`, class: "text-amber-600" };
    return { text: `Expires in ${days} days`, class: "text-slate-500" };
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
        {@const status = getExpiryStatus(item)}
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="font-medium text-slate-900">{item.product.name}</p>
              <p class="text-xs text-slate-500">Added {new Date(item.addedAt).toLocaleDateString()}</p>
              <p class="text-xs {status.class}">{status.text}</p>
            </div>
            <button
              class="text-xs text-red-600 hover:text-red-700"
              onclick={() => removeItem(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</section>
