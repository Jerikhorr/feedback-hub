import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '~/types/feedback'

interface DraftForm {
  title: string
  slug: string
  questions: Question[]
}

export const useFormBuilderStore = defineStore('formBuilder', () => {
  const draftForm = ref<DraftForm>({
    title: '',
    slug: '',
    questions: [],
  })

  const selectedQuestionId = ref<string | null>(null)

  const selectedQuestion = computed(() => {
    return draftForm.value.questions.find((q) => q.id === selectedQuestionId.value) || null
  })

  const addQuestion = (type: Question['type']) => {
    const newId = crypto.randomUUID()

    const newQuestion: Question = {
      id: newId,
      type: type,
      text: '',
      required: false,
      options: type === 'single_choice' || type === 'multiple_choice' ? ['Opsi 1'] : undefined,
    }

    draftForm.value.questions.push(newQuestion)
    selectedQuestionId.value = newId
  }

  const selectQuestion = (id: string) => {
    selectedQuestionId.value = id
  }

  const deleteQuestion = (id: string) => {
    const index = draftForm.value.questions.findIndex((q) => q.id === id)
    if (index !== -1) {
      draftForm.value.questions.splice(index, 1)
      if (selectedQuestionId.value === id) {
        selectedQuestionId.value = null
      }
    }
  }

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const questions = draftForm.value.questions
    if (direction === 'up' && index > 0) {
      const temp = questions[index] as Question
      questions[index] = questions[index - 1] as Question
      questions[index - 1] = temp
    } else if (direction === 'down' && index < questions.length - 1) {
      const temp = questions[index] as Question
      questions[index] = questions[index + 1] as Question
      questions[index + 1] = temp
    }
  }

  const reorderQuestions = (newOrder: Question[]) => {
    draftForm.value.questions = newOrder
  }

  return {
    draftForm,
    selectedQuestionId,
    selectedQuestion,
    addQuestion,
    selectQuestion,
    deleteQuestion,
    reorderQuestions,
    moveQuestion,
  }
})
