<script setup lang="ts">
import { useAdminDashboard } from '~/composables/useAdminDashboard'

definePageMeta({ layout: 'admin' })

const {
  activeTab,
  selectedSlug,
  tableColumns,
  tableRows,
  dropdownOptions,
  draftForm,
  rawResponses,
  savingStatus,
  isPreviewOpen,
  copied,
  isSupported,
  handleCopyLink,
  handleSaveForm,
  selectedBuilderSlug,
  handleCreateNewForm,
  handleDeleteForm,
} = useAdminDashboard()
</script>

<template>
  <div class="min-h-screen text-white font-sans w-full flex flex-col">
    <header class="border-b border-slate-800 sticky top-0 z-10 shadow-sm w-full bg-slate-900/80 backdrop-blur-md">
      <div class="px-6 h-16 flex items-center justify-between">
        <h1 class="text-xl font-bold tracking-tight">
          Admin
          <span class="text-slate-400 font-normal">| Admin Portal</span>
        </h1>

        <nav class="flex gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
          <button
            @click="activeTab = 'builder'"
            :class="[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              activeTab === 'builder'
                ? 'bg-primary-600 shadow-lg text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50',
            ]"
          >
            Form Builder 🛠️
          </button>
          <button
            @click="activeTab = 'responses'"
            :class="[
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              activeTab === 'responses'
                ? 'bg-primary-600 shadow-lg text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50',
            ]"
          >
            Respon User 📊
          </button>
        </nav>
      </div>
    </header>

    <main class="w-full flex-1">
      <AdminBuilderTab
        v-show="activeTab === 'builder'"
        :draft-form="draftForm"
        :copied="copied"
        :is-supported="isSupported"
        :saving-status="savingStatus"
        :dropdown-options="dropdownOptions"
        :handle-copy-link="handleCopyLink"
        :handle-save-form="handleSaveForm"
        :handle-create-new-form="handleCreateNewForm"
        :handle-delete-form="handleDeleteForm"
        v-model:is-preview-open="isPreviewOpen"
        v-model:selected-builder-slug="selectedBuilderSlug"
      />

      <AdminResponsesTab
        v-show="activeTab === 'responses'"
        v-model:selected-slug="selectedSlug"
        :dropdown-options="dropdownOptions"
        :raw-responses="rawResponses"
        :table-columns="tableColumns"
        :table-rows="tableRows"
      />
    </main>
  </div>
</template>
