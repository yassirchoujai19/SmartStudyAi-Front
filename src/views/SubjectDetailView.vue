<script setup>
import { ArrowLeft, Bot, FileText, Plus } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AlertMessage from '@/components/AlertMessage.vue'
import BaseModal from '@/components/BaseModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import EmptyState from '@/components/EmptyState.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import NoteCard from '@/components/NoteCard.vue'
import SkeletonCard from '@/components/SkeletonCard.vue'
import { useNotes } from '@/composables/useNotes'
import { useSubjects } from '@/composables/useSubjects'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const router = useRouter()
const { subject, loading, error, fetchOne } = useSubjects()
const { saving, error: noteError, create, update, remove } = useNotes()

const modalOpen = ref(false)
const editing = ref(null)
const form = ref({ title: '', content: '' })
const deleteTarget = ref(null)

onMounted(() => fetchOne(props.id))

function openCreate() {
  editing.value = null
  form.value = { title: '', content: '' }
  modalOpen.value = true
}

function openEdit(note) {
  editing.value = note
  form.value = { title: note.title, content: note.content }
  modalOpen.value = true
}

async function submit() {
  const result = editing.value
    ? await update(editing.value.id, form.value)
    : await create(props.id, form.value)

  if (result) {
    modalOpen.value = false
    await fetchOne(props.id)
  }
}

async function confirmDelete() {
  if (await remove(deleteTarget.value.id)) {
    deleteTarget.value = null
    await fetchOne(props.id)
  }
}

function askAI() {
  router.push({ name: 'chat', query: { subject: props.id } })
}
</script>

<template>
  <div class="space-y-6">
    <RouterLink
      :to="{ name: 'subjects' }"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
    >
      <ArrowLeft class="h-4 w-4" />
      Retour aux matières
    </RouterLink>

    <AlertMessage v-if="error" :message="error" />
    <AlertMessage v-if="noteError" :message="noteError" />

    <div v-if="loading && !subject" class="space-y-4">
      <SkeletonCard />
      <div class="grid gap-4 sm:grid-cols-2">
        <SkeletonCard v-for="n in 2" :key="n" />
      </div>
    </div>

    <template v-else-if="subject">
      <header class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-2xl font-bold text-slate-900">{{ subject.name }}</h2>
        <p class="mt-2 max-w-2xl text-slate-500">
          {{ subject.description || 'Aucune description.' }}
        </p>
        <p class="mt-4 text-sm text-slate-400">{{ subject.notes_count ?? 0 }} note(s)</p>
      </header>

      <section>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 class="text-lg font-semibold text-slate-900">Notes</h3>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            @click="openCreate"
          >
            <Plus class="h-4 w-4" />
            Ajouter une note
          </button>
        </div>

        <div v-if="subject.notes?.length" class="grid gap-4 sm:grid-cols-2">
          <NoteCard
            v-for="note in subject.notes"
            :key="note.id"
            :note="note"
            @edit="openEdit"
            @delete="deleteTarget = $event"
          />
        </div>

        <EmptyState
          v-else
          :icon="FileText"
          title="Aucune note dans cette matière."
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
      </section>

      <section class="rounded-2xl border border-brand-100 bg-brand-50 p-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="rounded-xl bg-brand-600 p-3 text-white">
              <Bot class="h-5 w-5" />
            </span>
            <div>
              <h3 class="font-semibold text-slate-900">Besoin d'aide ?</h3>
              <p class="text-sm text-slate-600">
                Interrogez l'assistant sur « {{ subject.name }} ».
              </p>
            </div>
          </div>

          <button
            type="button"
            class="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
            @click="askAI"
          >
            Demander à l'IA
          </button>
        </div>
      </section>
    </template>

    <BaseModal
      :open="modalOpen"
      :title="editing ? 'Modifier la note' : 'Nouvelle note'"
      @close="modalOpen = false"
    >
      <form class="space-y-4" @submit.prevent="submit">
        <div>
          <label for="note-title" class="mb-1.5 block text-sm font-medium text-slate-700">
            Titre
          </label>
          <input
            id="note-title"
            v-model="form.title"
            type="text"
            required
            maxlength="255"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div>
          <label for="note-content" class="mb-1.5 block text-sm font-medium text-slate-700">
            Contenu
          </label>
          <textarea
            id="note-content"
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
