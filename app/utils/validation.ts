import { z } from 'zod'
import type { Question } from '~/types/feedback'

export const getZodSchemaByQuestion = (question: Question) => {
  switch (question.type) {
    case 'text':
    case 'single_choice':
      return z.string().min(1)
    case 'rating':
      return z.number().min(1).max(5)
    case 'multiple_choice':
      return z.array(z.string()).min(1)
    default:
      return z.any()
  }
}

const adminQuestionSchema = z
  .object({
    id: z.string(),
    type: z.enum(['text', 'rating', 'single_choice', 'multiple_choice']),

    text: z
      .string()
      .trim()
      .min(1, { message: 'Teks pertanyaan tidak boleh kosong.' })
      .min(10, { message: 'Teks pertanyaan terlalu pendek (minimal 10 karakter).' }),

    required: z.boolean(),
    options: z.array(z.string().min(1, { message: 'Opsi pilihan tidak boleh kosong.' })).optional(),
  })
  .superRefine((data, ctx) => {
    if (['single_choice', 'multiple_choice'].includes(data.type)) {
      if (!data.options || data.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Soal pilihan ganda wajib memiliki minimal 2 opsi jawaban.',
          path: ['options'],
        })
      }
    }
  })

export const formConfigSchema = z.object({
  title: z.string().min(5, { message: 'Judul form minimal 5 karakter.' }),

  slug: z
    .string()
    .min(3, { message: 'Slug URL minimal 5 karakter.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug hanya boleh huruf kecil, angka, dan tanda strip (-) tanpa spasi.' }),

  questions: z.array(adminQuestionSchema).min(1, { message: 'Form minimal harus memiliki 1 pertanyaan.' }),
})
