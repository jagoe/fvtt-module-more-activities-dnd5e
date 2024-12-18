import { madActivityKeys } from '@/constants'
import { getAllOwnedWeapons } from '../foundry'
import { removeLinkedConsumables } from './removeLinkedConsumables'

export const resetActivities = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const extendedActivities = weapons
    .flatMap((w) => [...w.system.activities])
    .filter((a) => madActivityKeys.includes(a.id))

  await removeLinkedConsumables()

  for (const activity of extendedActivities) {
    await activity.parent.parent.deleteActivity(activity.id)
  }
}
