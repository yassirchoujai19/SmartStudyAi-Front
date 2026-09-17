<script setup>
defineProps({
  icon: { type: [Object, Function], required: true },
  label: { type: String, required: true },
  value: { type: [Number, String], required: true },
  loading: { type: Boolean, default: false },
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center gap-3">
      <span class="rounded-xl bg-brand-50 p-2.5 text-brand-600">
        <component :is="icon" class="h-5 w-5" />
      </span>
      <div>
        <p class="text-sm text-slate-500">{{ label }}</p>
        <p v-if="loading" class="mt-1 h-7 w-12 animate-pulse rounded bg-slate-100" />
        <p v-else class="text-2xl font-semibold text-slate-900">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
