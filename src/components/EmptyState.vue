<script setup>
defineProps({
  icon: { type: [Object, Function], default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center"
  >
    <div v-if="icon" class="mb-4 rounded-xl bg-brand-50 p-3 text-brand-600">
      <component :is="icon" class="h-6 w-6" />
    </div>
    <h3 class="text-base font-semibold text-slate-900">{{ title }}</h3>
    <p v-if="description" class="mt-1 max-w-sm text-sm text-slate-500">{{ description }}</p>
    <div class="mt-5">
      <slot />
    </div>
  </div>
</template>
