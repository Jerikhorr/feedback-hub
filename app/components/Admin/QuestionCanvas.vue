<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFormBuilderStore } from '~/stores/useFormBuilder'

const store = useFormBuilderStore()
const { draftForm, selectedQuestionId } = storeToRefs(store)
const { selectQuestion, deleteQuestion, moveQuestion, addQuestion } = store
</script>

<template>
  <div class="col-span-7 space-y-4 max-h-[75vh] overflow-y-auto pr-2 pb-10">
    <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-slate-300">
      <UIcon name="i-heroicons-list-bullet" />
      Canvas Pertanyaan
    </h2>

    <div
      v-for="(q, index) in draftForm.questions"
      :key="q.id"
      @click="selectQuestion(q.id)"
      :class="[
        'p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200',
        selectedQuestionId === q.id
          ? 'border-purple-500 bg-slate-800 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
          : 'border-slate-700 bg-slate-800/30 hover:border-slate-600',
      ]"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <UIcon
            name="i-heroicons-bars-3"
            class="text-slate-500 w-6 h-6 cursor-grab hover:text-white transition-colors"
          />
          <span
            class="bg-slate-700 text-slate-300 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center"
          >
            {{ index + 1 }}
          </span>
          <span
            class="font-medium text-lg"
            :class="q.text ? 'text-white' : 'text-slate-500 italic'"
          >
            {{ q.text || 'Pertanyaan belum diisi...' }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <UButton
            v-if="index > 0"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-up"
            @click.stop="moveQuestion(index, 'up')"
          />
          <UButton
            v-if="index < draftForm.questions.length - 1"
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-down"
            @click.stop="moveQuestion(index, 'down')"
          />
          <UButton
            color="warning"
            variant="ghost"
            icon="i-heroicons-trash"
            @click.stop="deleteQuestion(q.id)"
          />
        </div>
      </div>
    </div>

    <button
      @click="addQuestion('text')"
      class="w-full mt-6 py-6 border-2 border-dashed border-slate-600 rounded-2xl text-slate-400 font-semibold hover:border-purple-500 hover:text-purple-400 hover:bg-purple-500/10 transition-all flex justify-center items-center gap-2"
    >
      <UIcon
        name="i-heroicons-plus"
        class="w-6 h-6"
      />
      Tambah Pertanyaan Baru
    </button>
  </div>
</template>
