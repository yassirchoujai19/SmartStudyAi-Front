<script setup>
import { ArrowRight, BookOpen, Bot, FileText, MessageCircle, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import EmptyState from '@/components/EmptyState.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import StatCard from '@/components/StatCard.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import { useAuth } from '@/composables/useAuth'
import api, { humanError } from '@/services/api'

const { user } = useAuth()

const stats = ref({ subjects: 0, notes: 0, questions: 0 })
const recentSubjects = ref([])
const recentNotes = ref([])
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/dashboard')
    stats.value = data.data.stats
    recentSubjects.value = data.data.recent_subjects
    recentNotes.value = data.data.recent_notes
  } catch (e) {
    error.value = humanError(e, 'Impossible de charger le tableau de bord. Veuillez réessayer.')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="space-y-8">
    <header>
      <h2 class="text-2xl font-bold text-slate-900">Bonjour {{ user?.name }}</h2>
      <p class="mt-1 text-slate-500">Continuez votre apprentissage.</p>
    </header>

    <AlertMessage v-if="error" :message="error" />

    <section class="grid gap-4 sm:grid-cols-3">
      <StatCard :icon="BookOpen" label="Matières" :value="stats.subjects" :loading="loading" />
      <StatCard :icon="FileText" label="Notes" :value="stats.notes" :loading="loading" />
      <StatCard :icon="MessageCircle" label="Questions IA" :value="stats.questions" :loading="loading" />
    </section>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Mes matières</h3>
        <RouterLink
          :to="{ name: 'subjects' }"
          class="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          Tout voir
          <ArrowRight class="h-3.5 w-3.5" />
        </RouterLink>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard v-for="n in 3" :key="n" />
      </div>

      <div v-else-if="recentSubjects.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SubjectCard
          v-for="subject in recentSubjects"
          :key="subject.id"
          :subject="subject"
          :show-actions="false"
        />
      </div>

      <EmptyState
        v-else
        :icon="BookOpen"
        title="Aucune matière pour le moment."
        description="Commencez par créer votre première matière."
      >
        <RouterLink
          :to="{ name: 'subjects' }"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <Plus class="h-4 w-4" />
          Ajouter une matière
        </RouterLink>
      </EmptyState>
    </section>

    <section v-if="loading || recentNotes.length">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">Notes récentes</h3>
        <RouterLink
          :to="{ name: 'notes' }"
          class="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
        >
          Tout voir
          <ArrowRight class="h-3.5 w-3.5" />
        </RouterLink>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2">
        <SkeletonCard v-for="n in 2" :key="n" />
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <RouterLink
          v-for="note in recentNotes"
          :key="note.id"
          :to="{ name: 'subject-detail', params: { id: note.subject_id } }"
          class="block"
        >
          <article class="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h4 class="font-semibold text-slate-900">{{ note.title }}</h4>
            <span
              v-if="note.subject"
              class="mt-1 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
            >
              {{ note.subject.name }}
            </span>
            <p class="mt-3 line-clamp-2 whitespace-pre-line text-sm text-slate-500">
              {{ note.content }}
            </p>
          </article>
        </RouterLink>
      </div>
    </section>

    <!-- Accès rapide à l'assistant -->
    <section class="rounded-2xl border border-brand-100 bg-brand-50 p-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <span class="rounded-xl bg-brand-600 p-3 text-white">
            <Bot class="h-5 w-5" />
          </span>
          <div>
            <h3 class="font-semibold text-slate-900">Assistant IA</h3>
            <p class="text-sm text-slate-600">Posez une question à votre assistant d'étude.</p>
          </div>
        </div>

        <RouterLink
          :to="{ name: 'chat' }"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Ouvrir l'assistant
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </div>
    </section>
  </div>
</template>
