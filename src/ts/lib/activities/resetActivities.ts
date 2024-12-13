import { madActivityKeys } from '@/constants'
import { getAllOwnedWeapons } from '../foundry'

export const resetActivities = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const extendedActivities = weapons
    .flatMap((w) => [...w.system.activities])
    .filter((a) => madActivityKeys.includes(a.id))

  for (const activity of extendedActivities) {
    await activity.parent.parent.deleteActivity(activity.id)
  }
}
