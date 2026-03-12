<script setup lang="ts">
const isPreviewOpen = defineModel<boolean>('isPreviewOpen', { required: true })
const selectedBuilderSlug = defineModel<any>('selectedBuilderSlug', { required: true })

defineProps<{
  draftForm: any
  copied: boolean
  isSupported: boolean
  savingStatus: 'draft' | 'publish' | null
  dropdownOptions: any[]
  handleCopyLink: () => void
  handleSaveForm: (status: 'draft' | 'publish') => void
  handleCreateNewForm: () => void
  handleDeleteForm: () => void
}>()
</script>

<template>
  <div class="p-6 md:p-10">
    <div
      class="mb-6 flex flex-col md:flex-row items-center gap-4 bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-sm"
    >
      <USelectMenu
        v-model="selectedBuilderSlug"
        :items="dropdownOptions"
        label-key="label"
        value-key="value"
        placeholder="-- Pilih Form Untuk Diedit --"
        size="lg"
        icon="i-heroicons-folder-open"
        class="w-full md:flex-1"
      />

      <div class="flex gap-2 w-full md:w-auto">
        <UButton
          v-if="selectedBuilderSlug"
          color="error"
          variant="soft"
          icon="i-heroicons-trash"
          size="lg"
          @click="handleDeleteForm"
          title="Hapus Form Ini"
        />

        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-plus"
          size="lg"
          @click="handleCreateNewForm"
          class="flex-1 md:flex-none justify-center"
        >
          Buat Form Baru
        </UButton>
      </div>
    </div>

    <div
      class="mb-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm shadow-sm flex flex-col gap-6"
    >
      <div class="flex flex-col md:flex-row gap-6 w-full items-start">
        <UFormField
          label="Judul Form"
          class="flex-1 w-full"
        >
          <UInput
            v-model="draftForm.title"
            placeholder="cth: Feedback Karyawan"
            size="lg"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Slug URL"
          class="flex-1 w-full"
        >
          <div class="flex items-center gap-2 w-full">
            <UInput
              v-model="draftForm.slug"
              placeholder="cth: feedback-karyawan"
              size="lg"
              class="flex-1 w-full"
            />
            <
            <ClientOnly>
              <UTooltip
                v-if="isSupported"
                text="Copy Link Form"
              >
                <UButton
                  :color="copied ? 'success' : 'neutral'"
                  variant="soft"
                  size="xl"
                  :icon="copied ? 'i-heroicons-check-circle' : 'i-heroicons-clipboard-document'"
                  @click="handleCopyLink"
                  class="transition-all"
                />
              </UTooltip>
            </ClientOnly>
          </div>
        </UFormField>
      </div>

      <div class="w-full h-px bg-slate-700/50"></div>

      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-slate-400 flex items-center gap-2">
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-slate-500"
          />
          Simpan draft untuk diedit nanti, atau publish.
        </p>

        <div class="flex flex-wrap items-center gap-3 justify-end w-full sm:w-auto">
          <UButton
            color="neutral"
            variant="ghost"
            size="lg"
            icon="i-heroicons-eye"
            @click="isPreviewOpen = true"
          >
            Preview
          </UButton>
          <UButton
            color="neutral"
            variant="soft"
            size="lg"
            icon="i-heroicons-document-text"
            :loading="savingStatus === 'draft'"
            @click="handleSaveForm('draft')"
          >
            Simpan Draft
          </UButton>
          <UButton
            color="primary"
            size="lg"
            icon="i-heroicons-paper-airplane"
            :loading="savingStatus === 'publish'"
            @click="handleSaveForm('publish')"
          >
            Publish Form
          </UButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-12 gap-8 items-start">
      <AdminQuestionCanvas class="col-span-12 lg:col-span-7" />
      <AdminQuestionEditor class="col-span-12 lg:col-span-5" />
    </div>

    <USlideover
      v-model:open="isPreviewOpen"
      :title="draftForm.title || 'Form Tanpa Judul'"
      description="Mode Pratinjau Karyawan"
    >
      <template #body>
        <div class="space-y-8 pb-10">
          <div
            v-if="draftForm.questions.length === 0"
            class="text-center py-20 text-slate-500"
          >
            <UIcon
              name="i-heroicons-document-magnifying-glass"
              class="w-16 h-16 mx-auto mb-4 opacity-30"
            />
            <p class="text-lg">Belum ada pertanyaan untuk di-preview.</p>
          </div>

          <div
            v-for="(q, index) in draftForm.questions"
            :key="q.id"
            class="bg-slate-800 p-6 rounded-2xl border border-slate-700"
          >
            <div class="flex gap-4 mb-6">
              <span
                class="bg-primary-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30"
              >
                {{ index + 1 }}
              </span>
              <h3 class="text-lg font-medium text-white pt-1">
                {{ q.text || '...' }}
                <span
                  v-if="q.required"
                  class="text-red-400 ml-1"
                  title="Wajib Diisi"
                >
                  *
                </span>
              </h3>
            </div>

            <div
              v-if="q.type === 'text'"
              class="ml-12"
            >
              <UTextarea
                placeholder="Ketik jawaban Anda di sini..."
                disabled
                :rows="3"
              />
            </div>
            <div
              v-else-if="q.type === 'rating'"
              class="ml-12 flex gap-3"
            >
              <UButton
                v-for="i in 5"
                :key="i"
                color="neutral"
                variant="soft"
                disabled
                class="w-12 h-12 flex justify-center items-center text-lg font-bold rounded-xl"
              >
                {{ i }}
              </UButton>
            </div>
            <div
              v-else-if="['single_choice', 'multiple_choice'].includes(q.type)"
              class="ml-12 space-y-4"
            >
              <div
                v-for="(opt, oIdx) in q.options"
                :key="oIdx"
                class="flex items-center gap-3"
              >
                <div
                  :class="q.type === 'single_choice' ? 'rounded-full' : 'rounded'"
                  class="w-5 h-5 border-2 border-slate-500 opacity-50 flex-shrink-0"
                ></div>
                <span class="text-slate-300 text-base">{{ opt || 'Opsi kosong' }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
