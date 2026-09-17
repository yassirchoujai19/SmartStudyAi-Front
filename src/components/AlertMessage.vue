<script setup>
import { AlertCircle, CheckCircle2, Info } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  message: { type: String, required: true },
  variant: { type: String, default: 'error' },
})

const styles = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-brand-200 bg-brand-50 text-brand-700',
}

const icons = { error: AlertCircle, success: CheckCircle2, info: Info }

const icon = computed(() => icons[props.variant])
</script>

<template>
  <div :class="styles[variant]" class="flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm">
    <component :is="icon" class="mt-0.5 h-4 w-4 shrink-0" />
    <p>{{ message }}</p>
  </div>
</template>
