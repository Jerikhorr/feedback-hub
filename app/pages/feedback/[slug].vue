<script setup lang="ts">
import { useFeedbackForm } from '~/composables/useFeedbackForm'

definePageMeta({ layout: false })

const route = useRoute()
const router = useRouter()
const slug = route.params.slug as string

const {
  form,
  answers,
  currentIndex,
  isSubmitted,
  isSubmitting,
  currentQuestion,
  progressPercentage,
  isNextDisabled,
  handleNext,
  handlePrev,
  handleSubmit,
} = useFeedbackForm(slug)
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col font-sans text-gray-900">
    <ClientOnly>
      <div
        v-if="!form || !form.questions"
        class="flex-1 flex flex-col items-center justify-center"
      >
        <h1 class="text-3xl font-bold mb-2">Form Tidak Ditemukan</h1>
        <p class="text-gray-500">Pastikan link URL yang Anda masukkan benar.</p>
      </div>

      <div
        v-else-if="isSubmitted"
        class="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500"
      >
        <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6">
          ✓
        </div>
        <h1 class="text-3xl font-bold mb-4">Terima Kasih! 🎉</h1>
        <p class="text-gray-500 max-w-md mb-8">Masukan Anda sangat berharga bagi perkembangan kami</p>
        <UButton
          size="xl"
          color="neutral"
          class="px-8 rounded-full"
          @click="router.push('/')"
        >
          Tutup Halaman
        </UButton>
      </div>

      <div
        v-else
        class="flex-1 flex flex-col"
      >
        <header class="p-6 md:p-10 w-full max-w-4xl mx-auto">
          <div class="w-full bg-gray-100 rounded-full h-2">
            <div
              class="bg-black h-full rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            ></div>
          </div>
          <p class="mt-4 text-right text-sm text-gray-400 font-semibold tracking-widest uppercase">
            Soal {{ currentIndex + 1 }} dari {{ form?.questions?.length || 0 }}
          </p>
        </header>

        <main class="flex-1 flex flex-col justify-center items-center p-6 md:p-10">
          <Transition
            name="slide-up"
            mode="out-in"
          >
            <div
              :key="currentQuestion?.id"
              class="w-full max-w-2xl"
            >
              <h1 class="text-3xl md:text-4xl font-semibold leading-tight mb-3 flex items-start gap-2">
                <span>{{ currentQuestion?.text }}</span>
                <span
                  v-if="currentQuestion?.required"
                  class="text-red-500 text-2xl"
                  title="Wajib diisi"
                >
                  *
                </span>
              </h1>

              <p class="text-gray-400 text-sm font-medium mb-8">
                {{
                  currentQuestion?.required
                    ? 'Jawaban wajib diisi sebelum melanjutkan.'
                    : 'Opsional (Boleh dikosongkan).'
                }}
              </p>

              <div
                v-if="currentQuestion"
                class="space-y-4"
              >
                <FeedbackRating
                  v-if="currentQuestion.type === 'rating'"
                  v-model="answers[currentQuestion.id]"
                />
                <FeedbackSingleChoice
                  v-else-if="currentQuestion.type === 'single_choice'"
                  v-model="answers[currentQuestion.id]"
                  :options="currentQuestion.options || []"
                />
                <FeedbackMultipleChoice
                  v-else-if="currentQuestion.type === 'multiple_choice'"
                  v-model="answers[currentQuestion.id]"
                  :options="currentQuestion.options || []"
                />
                <FeedbackText
                  v-else-if="currentQuestion.type === 'text'"
                  v-model="answers[currentQuestion.id]"
                />
              </div>

              <div class="flex items-center gap-4 pt-12 mt-8 border-t border-gray-100">
                <UButton
                  v-if="currentIndex > 0"
                  variant="ghost"
                  color="neutral"
                  size="xl"
                  class="font-semibold"
                  @click="handlePrev"
                >
                  &larr; Sebelumnya
                </UButton>

                <div class="ml-auto flex gap-4">
                  <button
                    v-if="form?.questions && currentIndex < form.questions.length - 1"
                    @click="handleNext"
                    :disabled="isNextDisabled"
                    class="px-8 py-3 rounded-full font-semibold transition-all shadow-sm"
                    :class="
                      isNextDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-black hover:bg-gray-800 text-white'
                    "
                  >
                    Lanjut
                  </button>

                  <UButton
                    v-else
                    @click="handleSubmit"
                    :disabled="isNextDisabled"
                    :loading="isSubmitting"
                    size="xl"
                    class="px-8 rounded-full font-bold transition-all shadow-sm flex items-center justify-center min-w-45"
                    :class="
                      isNextDisabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-[#00DF80] hover:bg-[#00C570] text-gray-900'
                    "
                  >
                    Kirim Feedback ✨
                  </UButton>
                </div>
              </div>
            </div>
          </Transition>
        </main>
      </div>

      <template #fallback>
        <div class="flex-1 flex flex-col items-center justify-center py-32">
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-12 h-12 text-[#00DF80] animate-spin"
          />
          <p class="mt-4 text-gray-400 font-medium animate-pulse">Menyiapkan lembar form</p>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
