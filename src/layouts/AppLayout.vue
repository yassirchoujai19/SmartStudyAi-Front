<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const route = useRoute()
const sidebarOpen = ref(false)

const titles = {
  dashboard: 'Dashboard',
  subjects: 'Matières',
  'subject-detail': 'Matière',
  notes: 'Notes',
  chat: 'Assistant IA',
  settings: 'Paramètres',
}

const title = computed(() => titles[route.name] ?? 'SmartStudy AI')
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:pl-64">
      <AppHeader :title="title" @toggle-sidebar="sidebarOpen = !sidebarOpen" />
      <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
