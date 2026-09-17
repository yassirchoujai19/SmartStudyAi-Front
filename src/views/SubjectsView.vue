<script setup>
import { BookOpen, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import AlertMessage from '@/components/AlertMessage.vue'
import BaseModal from '@/components/BaseModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import SubjectCard from '@/components/SubjectCard.vue'
import { useSubjects } from '@/composables/useSubjects'

const { subjects, loading, saving, error, fetchAll, create, update, remove } = useSubjects()

const modalOpen = ref(false)
const editing = ref(null)
const form = ref({ name: '', description: '' })
const deleteTarget = ref(null)

onMounted(fetchAll)

function openCreate() {
  editing.value = null
  form.value = { name: '', description: '' }
  modalOpen.value = true
}

function openEdit(subject) {
  editing.value = subject
  form.value = { name: subject.name, description: subject.description ?? '' }
  modalOpen.value = true
}

async function submit() {
  const result = editing.value
    ? await update(editing.value.id, form.value)
    : await create(form.value)

  if (result) {
    modalOpen.value = false
  }
}

async function confirmDelete() {
  if (await remove(deleteTarget.value.id)) {
    deleteTarget.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-2xl font-bold text-slate-900">Mes matières</h2>
        <p class="mt-1 text-slate-500">Organisez vos cours par matière.</p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Nouvelle matière
      </button>
    </header>

    <AlertMessage v-if="error" :message="error" />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SkeletonCard v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="subjects.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SubjectCard
        v-for="subject in subjects"
        :key="subject.id"
        :subject="subject"
        @edit="openEdit"
        @delete="deleteTarget = $event"
      />
    </div>

    <EmptyState
      v-else
      :icon="BookOpen"
      title="Aucune matière pour le moment."
      description="Commencez par créer votre première matière."
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Ajouter une matière
      </button>
    </EmptyState>

    <BaseModal
      :open="modalOpen"
      :title="editing ? 'Modifier la matière' : 'Nouvelle matière'"
      @close="modalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label for="subject-name" class="mb-1.5 block text-sm font-medium text-slate-700">
            Nom
          </label>
          <input
            id="subject-name"
            v-model="form.name"
            type="text"
            required
            maxlength="255"
            placeholder="Laravel, Mathématiques…"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label for="subject-description" class="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="subject-description"
            v-model="form.description"
            rows="3"
            maxlength="1000"
            placeholder="À quoi sert cette matière ?"
            class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            @click="modalOpen = false"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            <LoadingSpinner v-if="saving" size="sm" />
            Enregistrer
          </button>
        </div>
      </form>
    </BaseModal>

    <ConfirmDialog
      :open="Boolean(deleteTarget)"
      :loading="saving"
      title="Supprimer cette matière ?"
      :message="`« ${deleteTarget?.name} » et toutes ses notes seront définitivement supprimées.`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
