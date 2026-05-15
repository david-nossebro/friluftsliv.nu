import type { ActivityType } from '@/types'

const PINE = '#2C4A3E'

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  vandring: '#4A7C59',   // moss
  topptur: PINE,
  skidtur: '#B5C9A1',    // birch
  cykeltur: '#6B5B45',   // earth
  paddeltur: '#A8C4D4',  // sky
  stugtur: PINE,
}

/**
 * Brand hex for the polyline / chart line of a given activity. Falls back to
 * pine when no activity is provided (matches the previous map default).
 */
export function getActivityColor(activityType?: ActivityType): string {
  if (!activityType) return PINE
  return ACTIVITY_COLORS[activityType] ?? PINE
}
