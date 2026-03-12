import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { getZodSchemaByQuestion } from '~/utils/validation'
import type { Question, FormConfig } from '~/types/feedback'

export const useFeedbackForm = (slug: string) => {
  const toast = useToast()

  const storedForm = useLocalStorage<any>(`denova_form_${slug}`, null)
  const answers = useLocalStorage<Record<string, string | number | string[]>>(`denova_feedback_${slug}`, {})
  const formResponses = useLocalStorage<any[]>(`denova_responses_${slug}`, [])

  const currentIndex = ref(0)
  const isSubmitted = ref(false)
  const isSubmitting = ref(false)

  const form = computed<FormConfig | undefined>(() => {
    if (!storedForm.value) return undefined
    if (typeof storedForm.value === 'string') {
      try {
        return JSON.parse(storedForm.value) as FormConfig
      } catch (e) {
        return undefined
      }
    }
    return storedForm.value as FormConfig
  })

  const currentQuestion = computed<Question | undefined>(() => form.value?.questions?.[currentIndex.value])

  const progressPercentage = computed(() => {
    const qLength = form.value?.questions?.length || 0
    if (!qLength) return 0
    return ((currentIndex.value + 1) / qLength) * 100
  })

  watch(
    () => form.value,
    (newForm) => {
      if (newForm && newForm.questions) {
        const validQuestionIds = newForm.questions.map((q) => q.id)
        answers.value = Object.fromEntries(
          Object.entries(answers.value).filter(([key]) => validQuestionIds.includes(key)),
        )
      }
    },
    { immediate: true },
  )

  const validateSingleAnswer = (question: Question, answer: any): boolean => {
    const isAnswerEmpty = answer === undefined || answer === '' || (Array.isArray(answer) && answer.length === 0)
    if (question.required && isAnswerEmpty) return false
    if (!question.required && isAnswerEmpty) return true

    try {
      const schema = getZodSchemaByQuestion(question)
      return schema.safeParse(answer).success
    } catch (error) {
      return false
    }
  }

  const isNextDisabled = computed(() => {
    if (!currentQuestion.value) return true
    return !validateSingleAnswer(currentQuestion.value, answers.value[currentQuestion.value.id])
  })

  const validateAllAnswers = (): boolean => {
    if (!form.value?.questions) return false
    return form.value.questions.every((q) => validateSingleAnswer(q, answers.value[q.id]))
  }

  const handleNext = () => {
    if (!isNextDisabled.value && form.value?.questions && currentIndex.value < form.value.questions.length - 1) {
      currentIndex.value++
    }
  }

  const handlePrev = () => {
    if (currentIndex.value > 0) currentIndex.value--
  }

  const handleSubmit = async () => {
    if (!validateAllAnswers()) {
      toast.add({
        title: 'Data Belum Lengkap 🚨',
        description: 'Masih ada jawaban yang belum sesuai format. Coba cek lagi ya!',
        icon: 'i-heroicons-exclamation-circle',
        color: 'warning',
        duration: 3000,
      })
      return
    }

    isSubmitting.value = true

    try {
      const todayDate = new Date().toISOString().split('T')[0]
      const payloadUntukBackend = {
        submitted_date: todayDate,
        answers: { ...answers.value },
      }

      console.log('🚀 DATA SIAP KIRIM KE BACKEND:', JSON.stringify(payloadUntukBackend, null, 2))

      formResponses.value.push(payloadUntukBackend)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      answers.value = {}
      isSubmitted.value = true
    } catch (error) {
      toast.add({
        title: 'Gagal Terhubung 🌐',
        description: 'Gagal mengirim data feedback. Silakan coba lagi.',
        icon: 'i-heroicons-wifi',
        color: 'warning',
        duration: 4000,
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
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
  }
}
