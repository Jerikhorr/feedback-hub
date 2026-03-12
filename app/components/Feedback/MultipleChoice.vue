<script setup lang="ts">
const model = defineModel<string[]>({ default: () => [] })
defineProps<{ options: string[] }>()

const toggle = (opt: string) => {
  const currentSelections = Array.isArray(model.value) ? [...model.value] : []
  const index = currentSelections.indexOf(opt)

  if (index === -1) currentSelections.push(opt)
  else currentSelections.splice(index, 1)

  model.value = currentSelections
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <button
      v-for="(opt, idx) in options"
      :key="idx"
      @click="toggle(opt)"
      type="button"
      :class="[
        'w-full text-left px-6 py-4 rounded-xl border-2 transition-all font-medium text-lg flex justify-between items-center shadow-sm',
        model?.includes(opt)
          ? 'border-black bg-gray-50 ring-1 ring-black'
          : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50',
      ]"
    >
      <span>{{ opt }}</span>
      <span
        v-if="model?.includes(opt)"
        class="text-black font-bold"
      >
        ✓
      </span>
    </button>
  </div>
</template>
