import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useFormBuilderStore } from '~/stores/useFormBuilder'
import { formConfigSchema } from '~/utils/validation'
import { useClipboard } from '@vueuse/core'
import type { FormConfig } from '~/types/feedback'

export const useAdminDashboard = () => {
  const toast = useToast()
  const activeTab = ref<'builder' | 'responses'>('builder')

  const allForms = ref<FormConfig[]>([])
  const rawResponses = ref<any[]>([])

  onMounted(() => {
    const stored = localStorage.getItem('denova_forms')
    if (stored) {
      try {
        allForms.value = JSON.parse(stored)
      } catch (e) {
        console.error('Gagal parse form:', e)
      }
    }
  })

  const dropdownOptions = computed(() => {
    return allForms.value.map((f) => ({
      label: f.title || 'Form Tanpa Judul',
      value: f.slug,
    }))
  })

  const selectedSlug = ref<any>('')

  const activeSlug = computed(() => {
    if (!selectedSlug.value) return ''
    return typeof selectedSlug.value === 'object' ? selectedSlug.value.value : selectedSlug.value
  })

  const currentForm = computed(() => allForms.value.find((f) => f.slug === activeSlug.value) || null)

  watch(activeSlug, (newSlug) => {
    if (typeof window !== 'undefined' && newSlug) {
      const data = localStorage.getItem(`denova_responses_${newSlug}`)
      rawResponses.value = data ? JSON.parse(data) : []
    } else {
      rawResponses.value = []
    }
  })

  const tableColumns = computed(() => {
    if (!currentForm.value) return []
    const cols = [{ accessorKey: 'submitted_date', header: 'Tanggal Masuk' }]

    currentForm.value.questions.forEach((q) => {
      cols.push({
        accessorKey: q.id,
        // 💡 Langsung panggil q.text utuh, jangan dipotong pakai substring!
        header: q.text,
      })
    })
    return cols
  })

  const tableRows = computed(() => {
    return rawResponses.value.map((res: any) => {
      const rowData: any = { submitted_date: res.submitted_date }
      if (res.answers) {
        for (const [questionId, answer] of Object.entries(res.answers)) {
          rowData[questionId] = Array.isArray(answer) ? answer.join(', ') : answer
        }
      }
      return rowData
    })
  })

  const store = useFormBuilderStore()
  const { draftForm, selectedQuestionId } = storeToRefs(store)

  const savingStatus = ref<'draft' | 'publish' | null>(null)
  const isPreviewOpen = ref(false)
  const { copy, copied, isSupported } = useClipboard()

  const selectedBuilderSlug = ref<any>('')

  const activeBuilderSlug = computed(() => {
    if (!selectedBuilderSlug.value) return ''
    return typeof selectedBuilderSlug.value === 'object' ? selectedBuilderSlug.value.value : selectedBuilderSlug.value
  })

  watch(activeBuilderSlug, (newSlug) => {
    if (newSlug) {
      const formToEdit = allForms.value.find((f) => f.slug === newSlug)
      if (formToEdit) {
        draftForm.value = JSON.parse(JSON.stringify(formToEdit))
        selectedQuestionId.value = null
      }
    }
  })

  const handleCreateNewForm = () => {
    selectedBuilderSlug.value = ''
    draftForm.value = { title: '', slug: '', questions: [] }
    selectedQuestionId.value = null
  }

  const handleDeleteForm = () => {
    const slugToDelete = activeBuilderSlug.value
    if (!slugToDelete) return

    const isConfirmed = window.confirm('Apakah Anda yakin ingin menghapus form ini?')
    if (!isConfirmed) return

    allForms.value = allForms.value.filter((f) => f.slug !== slugToDelete)
    localStorage.setItem('denova_forms', JSON.stringify(allForms.value))

    localStorage.removeItem(`denova_form_${slugToDelete}`)
    localStorage.removeItem(`denova_responses_${slugToDelete}`)

    handleCreateNewForm()

    toast.add({
      title: 'Form Dihapus 🗑️',
      description: 'Form beserta datanya telah permanen dihapus.',
      color: 'success',
    })
  }

  const handleCopyLink = () => {
    if (!draftForm.value.slug) {
      toast.add({
        title: 'Slug Kosong',
        description: 'Isi dulu slug URL-nya',
        color: 'warning',
        icon: 'i-heroicons-exclamation-circle',
      })
      return
    }
    const fullUrl = `http://localhost:3000/feedback/${draftForm.value.slug}`
    copy(fullUrl)
    toast.add({ title: 'Link Disalin! 📋', color: 'success' })
  }

  const handleSaveForm = async (status: 'draft' | 'publish') => {
    const rawData = JSON.parse(JSON.stringify(draftForm.value))
    const result = formConfigSchema.safeParse(rawData)

    if (!result.success) {
      console.log('ZOD ISSUES DETECTED:', result.error.issues)

      const firstErrorMessage = result.error?.issues?.[0]?.message || 'Terdapat kesalahan pada isian form.'

      toast.add({
        title: 'Validasi Gagal 🚨',
        description: firstErrorMessage,
        color: 'warning',
        duration: 4000,
      })
      return
    }

    savingStatus.value = status
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (status === 'publish') {
        localStorage.setItem(`denova_form_${result.data.slug}`, JSON.stringify(result.data))

        const existingIndex = allForms.value.findIndex((f) => f.slug === result.data.slug)
        if (existingIndex >= 0) {
          allForms.value[existingIndex] = result.data
        } else {
          allForms.value.push(result.data)
        }

        localStorage.setItem('denova_forms', JSON.stringify(allForms.value))
        selectedBuilderSlug.value = result.data.slug
      }

      toast.add({ title: status === 'publish' ? 'Berhasil Di-Publish! 🚀' : 'Draft Disimpan 📝', color: 'success' })
    } finally {
      savingStatus.value = null
    }
  }

  return {
    activeTab,
    selectedSlug,
    selectedBuilderSlug,
    rawResponses,
    tableColumns,
    tableRows,
    dropdownOptions,
    draftForm,
    savingStatus,
    isPreviewOpen,
    copied,
    isSupported,
    handleCopyLink,
    handleSaveForm,
    handleCreateNewForm,
    handleDeleteForm,
  }
}
