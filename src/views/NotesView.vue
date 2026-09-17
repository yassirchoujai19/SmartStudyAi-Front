<script setup>
import { FileText, Plus } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import BaseModal from '@/components/BaseModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoteCard from '@/components/NoteCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useNotes } from '@/composables/useNotes'
import { useSubjects } from '@/composables/useSubjects'

const { notes, loading, saving, error, fetchAll, create, update, remove } = useNotes()
const { subjects, fetchAll: fetchSubjects } = useSubjects()

const filter = ref('')
const modalOpen = ref(false)
const editing = ref(null)
const form = ref({ title: '', content: '', subject_id: '' })
const deleteTarget = ref(null)

const visibleNotes = computed(() =>
  filter.value ? notes.value.filter((n) => String(n.subject_id) === filter.value) : notes.value,
)

onMounted(() => {
  fetchAll()
  fetchSubjects()
})

function openCreate() {
  editing.value = null
  form.value = { title: '', content: '', subject_id: filter.value || subjects.value[0]?.id || '' }
  modalOpen.value = true
}

function openEdit(note) {
  editing.value = note
  form.value = { title: note.title, content: note.content, subject_id: note.subject_id }
  modalOpen.value = true
}

async function submit() {
  const result = editing.value
    ? await update(editing.value.id, form.value)
    : await create(form.value.subject_id, { title: form.value.title, content: form.value.content })

  if (result) {
    modalOpen.value = false
    await fetchAll()
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
        <h2 class="text-2xl font-bold text-slate-900">Mes notes</h2>
        <p class="mt-1 text-slate-500">Toutes vos notes de cours, toutes matières confondues.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="filter"
          class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          aria-label="Filtrer par matière"
        >
          <option value="">Toutes les matières</option>
          <option v-for="subject in subjects" :key="subject.id" :value="String(subject.id)">
            {{ subject.name }}
          </option>
        </select>

        <button
          type="button"
          :disabled="!subjects.length"
          class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
          @click="openCreate"
        >
          <Plus class="h-4 w-4" />
          Nouvelle note
        </button>
      </div>
    </header>

    <AlertMessage v-if="error" :message="error" />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2">
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>

    <div v-else-if="visibleNotes.length" class="grid gap-4 sm:grid-cols-2">
      <NoteCard
        v-for="note in visibleNotes"
        :key="note.id"
        :note="note"
        show-subject
        @edit="openEdit"
        @delete="deleteTarget = $event"
      />
    </div>

    <EmptyState
      v-else-if="!subjects.length"
      :icon="FileText"
      title="Aucune note pour le moment."
      description="Créez d'abord une matière, puis ajoutez-y vos notes."
    >
      <RouterLink
        :to="{ name: 'subjects' }"
        class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        <Plus class="h-4 w-4" />
        Ajouter une matière
      </RouterLink>
    </EmptyState>

    <EmptyState
      v-else
      :icon="FileText"
      title="Aucune note pour le moment."
      description="Ajoutez votre premier résumé de cours."
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        @click="openCreate"
      >
        <Plus class="h-4 w-4" />
        Ajouter une note
      </button>
    </EmptyState>

    <BaseModal
      :open="modalOpen"
      :title="editing ? 'Modifier la note' : 'Nouvelle note'"
      @close="modalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label for="note-subject" class="mb-1.5 block text-sm font-medium text-slate-700">
            Matière
          </label>
          <select
            id="note-subject"
            v-model="form.subject_id"
            required
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div>
          <label for="all-note-title" class="mb-1.5 block text-sm font-medium text-slate-700">
            Titre
          </label>
          <input
            id="all-note-title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label for="all-note-content" class="mb-1.5 block text-sm font-medium text-slate-700">
            Contenu
          </label>
          <textarea
            id="all-note-content"
            v-model="form.content"
            rows="8"
            required
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
      title="Supprimer cette note ?"
      :message="`« ${deleteTarget?.title} » sera définitivement supprimée.`"
      @confirm="confirmDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>
