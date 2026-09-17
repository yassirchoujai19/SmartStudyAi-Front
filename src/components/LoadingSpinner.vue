<script setup>
defineProps({
  label: { type: String, default: '' },
  size: { type: String, default: 'md' },
})

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
}
</script>

<template>
  <div class="flex items-center justify-center gap-3 text-slate-500">
    <span
      :class="sizes[size]"
      class="animate-spin rounded-full border-slate-200 border-t-brand-600"
      role="status"
      aria-label="Chargement"
    />
    <span v-if="label" class="text-sm">{{ label }}</span>
  </div>
</template>
