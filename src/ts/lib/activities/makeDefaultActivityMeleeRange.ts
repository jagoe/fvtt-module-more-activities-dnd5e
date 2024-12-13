import { dnd5eDefaultActivityKey } from '@/constants'

export const makeDefaultActivityMeleeRange = async (weapon: Item, defaultActivity: Activity) =>
  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    range: {
      ...defaultActivity.range,
      override: true,
      value: weapon.system.range.reach,
    },
  })
