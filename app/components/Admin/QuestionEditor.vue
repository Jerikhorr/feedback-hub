<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFormBuilderStore } from '~/stores/useFormBuilder'

const store = useFormBuilderStore()

const { selectedQuestion } = storeToRefs(store)

const typeItems = [
  { label: 'Teks Bebas', value: 'text' },
  { label: 'Rating (1-5)', value: 'rating' },
  { label: 'Pilihan (Satu Jawaban)', value: 'single_choice' },
  { label: 'Pilihan (Banyak Jawaban)', value: 'multiple_choice' },
]

const handleTypeChange = (newType: string) => {
  const q = selectedQuestion.value
  if (!q) return

  if (['single_choice', 'multiple_choice'].includes(newType)) {
    if (!q.options || q.options.length === 0) {
      q.options = ['Pilihan 1']
    }
  } else {
    q.options = undefined
  }
}

const addOption = () => {
  const q = selectedQuestion.value
  if (!q) return

  if (!q.options) {
    q.options = []
  }
  q.options.push('Pilihan baru')
}

const removeOption = (index: number) => {
  const q = selectedQuestion.value
  if (!q || !q.options) return

  q.options.splice(index, 1)
}
</script>

<template>
  <div class="col-span-5 sticky top-10">
    <div class="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl min-h-[400px] backdrop-blur-md">
      <div
        v-if="!selectedQuestion"
        class="flex flex-col items-center justify-center h-full text-slate-500 py-32 text-center"
      >
        <UIcon
          name="i-heroicons-cursor-arrow-rays"
          class="w-16 h-16 mb-4 opacity-50"
        />
        <p class="text-lg">
          Pilih salah satu soal di Canvas
          <br />
          untuk mulai mengedit.
        </p>
      </div>

      <div
        v-else
        class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
      >
        <div class="border-b border-slate-700 pb-4 mb-6 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white">⚙️ Pengaturan Soal</h3>
          <UBadge
            color="purple"
            variant="subtle"
          >
            ID: {{ selectedQuestion.id.slice(0, 6) }}
          </UBadge>
        </div>

        <UFormField label="Teks Pertanyaan">
          <UTextarea
            v-model="selectedQuestion.text"
            placeholder="Ketik pertanyaan di sini..."
            :rows="8"
          />
        </UFormField>

        <div class="flex gap-4">
          <UFormField
            label="Tipe Jawaban"
            class="flex-1"
          >
            <USelectMenu
              v-model="selectedQuestion.type"
              :items="typeItems"
              label-key="label"
              value-key="value"
              @update:model-value="handleTypeChange"
            />
          </UFormField>

          <UFormField
            label="Wajib Diisi?"
            class="flex items-end pb-1.5 mx-2"
          >
            <USwitch
              class="mx-2"
              v-model="selectedQuestion.required"
              size="xl"
            />
          </UFormField>
        </div>

        <div
          v-if="['single_choice', 'multiple_choice'].includes(selectedQuestion.type)"
          class="bg-slate-900/50 p-5 rounded-2xl border border-slate-700 mt-6"
        >
          <p class="text-sm font-semibold text-purple-400 mb-4 flex items-center gap-2">
            <UIcon name="i-heroicons-list-bullet" />
            Opsi Pilihan Jawaban
          </p>

          <div class="space-y-3">
            <div
              v-for="(opt, idx) in selectedQuestion.options"
              :key="idx"
              class="flex items-center gap-3 group"
            >
              <UIcon
                name="i-heroicons-bars-3"
                class="text-slate-600 w-5 h-5 cursor-grab"
              />

              <UInput
                v-model="selectedQuestion.options[idx]"
                placeholder="Ketik pilihan jawaban..."
                class="flex-1"
                size="md"
                :ui="{ base: 'focus:ring-purple-500' }"
              />

              <UButton
                color="red"
                variant="ghost"
                icon="i-heroicons-trash"
                @click="removeOption(idx)"
                :disabled="selectedQuestion.options.length <= 1"
                class="opacity-50 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <UButton
            color="purple"
            variant="soft"
            icon="i-heroicons-plus"
            class="mt-5 w-full justify-center border border-purple-500/30 border-dashed hover:border-purple-500/60"
            @click="addOption"
          >
            Tambah Pilihan Baru
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
