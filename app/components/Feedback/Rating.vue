<script setup lang="ts">
// 1. Jembatan komunikasi untuk menangkap angka rating
const model = defineModel<number>()
</script>

<template>
  <div class="flex gap-4 flex-wrap">
    <button
      v-for="num in 5"
      :key="num"
      @click="model = num"
      :class="[
        'h-14 w-14 md:h-16 md:w-16 text-xl rounded-xl border-2 transition-all font-semibold shadow-sm',
        model === num
          ? 'border-black bg-black text-white scale-105'
          : 'border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50',
      ]">
      {{ num }}
    </button>
  </div>
</template>
