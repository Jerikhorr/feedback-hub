<script setup lang="ts">
const model = defineModel<string | number | string[]>()
</script>

<template>
  <textarea
    v-model="model"
    placeholder="Ketik masukan atau saran Anda di sini..."
    rows="6"
    class="w-full bg-gray-50 text-gray-900 placeholder-gray-400 p-6 rounded-2xl border border-gray-200 focus:bg-white focus:border-[#00DF80] focus:ring-4 focus:ring-[#00DF80]/20 focus:outline-none resize-none transition-all duration-300 shadow-sm text-lg leading-relaxed"
  ></textarea>
</template>
