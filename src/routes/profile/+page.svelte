<script lang="ts">
  import { db } from "$lib/stores/db.js";
  import { onMount } from "svelte";
  import type { Profile } from "$lib/types/index.js";

  let profile: Profile = {
    id: "default",
    name: "My Profile",
    diets: [],
    allergies: [],
    redLines: [],
    goals: [],
    healthDataEnabled: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  let allergiesText = profile.allergies.join(", ");
  let redLinesText = profile.redLines.join(", ");

  onMount(async () => {
    const existing = await db.profiles.get("default");
    if (existing) {
      profile = existing;
      allergiesText = existing.allergies.join(", ");
      redLinesText = existing.redLines.join(", ");
    } else {
      await db.profiles.put(profile);
    }
  });

  async function save() {
    profile.allergies = allergiesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    profile.redLines = redLinesText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    profile.updatedAt = Date.now();
    await db.profiles.put(profile);
    alert("Profile saved");
  }
</script>

<section class="space-y-6">
  <h1 class="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>

  <div class="grid gap-4">
    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label for="profile-name" class="block text-sm font-medium text-slate-700">Profile name</label>
      <input id="profile-name" class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" bind:value={profile.name} />
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label for="allergies" class="block text-sm font-medium text-slate-700">Allergies</label>
      <input
        id="allergies"
        class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
        placeholder="e.g. peanuts, dairy"
        bind:value={allergiesText}
      />
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label for="red-lines" class="block text-sm font-medium text-slate-700">Red lines</label>
      <input
        id="red-lines"
        class="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2"
        placeholder="e.g. Red 40, high fructose corn syrup"
        bind:value={redLinesText}
      />
    </div>

    <button
      class="rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      onclick={save}
    >
      Save profile
    </button>
  </div>
</section>
