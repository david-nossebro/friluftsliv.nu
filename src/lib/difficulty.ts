import type { Difficulty } from '@/types'

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Lätt',
  medium: 'Medel',
  hard: 'Krävande',
}

export const DIFFICULTY_HINTS: Record<Difficulty, string> = {
  easy: 'Lätta turer för korta dagar.',
  medium: 'Längre dagar och varierad terräng.',
  hard: 'Mer tid, vana och utrustning.',
}

export const ALL_DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard']

export function formatDifficulty(d: Difficulty): string {
  return DIFFICULTY_LABELS[d]
}
