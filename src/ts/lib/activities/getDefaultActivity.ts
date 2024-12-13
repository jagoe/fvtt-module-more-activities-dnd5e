import { dnd5eDefaultActivityKey } from '@/constants'

export const getDefaultActivity = (weapon: Item) => {
  const activities = weapon.system.activities
  const defaultActivity = activities.get(dnd5eDefaultActivityKey)

  return defaultActivity
}
