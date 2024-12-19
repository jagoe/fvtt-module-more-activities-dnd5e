import { dnd5eDefaultActivityKey } from '@/constants'

export const getDefaultActivity = (weapon: Item) => {
  const activities = weapon.system.activities
  let defaultActivity = activities.get(dnd5eDefaultActivityKey)

  if (!defaultActivity) {
    defaultActivity = activities.find(activity => activity.type === 'attack')
  }

  return defaultActivity
}
