<script setup lang="ts">
const model = defineModel<string>()
defineProps<{ options: string[] }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="(opt, idx) in options"
      :key="idx"
      @click="model = opt"
      type="button"
      :class="[
        'w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg shadow-sm',
        model === opt
          ? 'border-black bg-gray-50 ring-1 ring-black'
          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
      ]"
    >
      {{ opt }}
    </button>
  </div>
</template>
