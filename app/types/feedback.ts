export type QuestionType = 'text' | 'rating' | 'single_choice' | 'multiple_choice'

export interface Question {
  id: string
  type: QuestionType
  text: string
  required: boolean
  options?: string[]
}

export interface FormConfig {
  slug: string
  title: string
  questions: Question[]
}
