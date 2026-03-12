<script setup lang="ts">
// Vue 3.4 feature
const selectedSlug = defineModel<any>('selectedSlug', { required: true })

defineProps<{
  dropdownOptions: any[]
  rawResponses: any[]
  tableColumns: any[]
  tableRows: any[]
}>()
</script>

<template>
  <div class="p-6 md:p-10">
    <ClientOnly>
      <div class="space-y-8 animate-in fade-in max-w-7xl mx-auto">
        <div
          class="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-lg"
        >
          <div>
            <h2 class="text-2xl font-bold text-white">Hasil Tanggapan</h2>
            <p class="text-slate-400 text-sm">Pilih form untuk melihat respon karyawan.</p>
          </div>

          <USelectMenu
            v-model="selectedSlug"
            :items="dropdownOptions"
            label-key="label"
            value-key="value"
            placeholder="-- Pilih Kuesioner --"
            size="xl"
            icon="i-heroicons-document-text"
            class="w-full md:w-80"
          />
        </div>

        <div
          v-if="selectedSlug"
          class="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden shadow-lg backdrop-blur-sm"
        >
          <div
            v-if="rawResponses.length === 0"
            class="p-16 text-center"
          >
            <UIcon
              name="i-heroicons-inbox"
              class="w-16 h-16 text-slate-600 mx-auto mb-3"
            />
            <h3 class="text-lg font-bold text-white">Belum Ada Tanggapan</h3>
            <p class="text-slate-400 mt-2">Belum ada data masuk untuk form kuesioner ini.</p>
          </div>

          <div
            v-else
            class="overflow-x-auto p-4"
          >
            <UTable
              :columns="tableColumns"
              :data="tableRows"
              class="w-full"
              :ui="{
                th: 'whitespace-normal break-words min-w-[200px] max-w-[350px] align-top',
                td: 'whitespace-normal break-words min-w-[200px] max-w-[350px] align-top',
              }"
            />
          </div>
        </div>

        <div
          v-else
          class="py-20 text-center"
        >
          <div
            class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-sm"
          >
            <UIcon
              name="i-heroicons-cursor-arrow-rays"
              class="w-8 h-8 text-slate-500"
            />
          </div>
          <p class="text-slate-400 font-medium text-lg">Silakan pilih form kuesioner di atas terlebih dahulu.</p>
        </div>
      </div>

      <template #fallback>
        <div class="py-20 flex justify-center">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-8 h-8 text-slate-600 animate-spin"
          />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
