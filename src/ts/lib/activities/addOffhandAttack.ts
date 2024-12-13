import { MadActivityKey } from '@/constants'
import { getDefaultActivity } from './getDefaultActivity'
import { NoDefaultActivityError } from '@/models'
import { i18n } from '../foundry'

export const hasOffhandAttack = (weapon: Item) => weapon.system.activities.has(MadActivityKey.OffhandActivityKey)

export const addOffhandAttack = async (weapon: Item) => {
  if (hasOffhandAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }

  const offhandActivitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.OffhandActivityKey,
    name: i18n('MAD.activities.offhand.name'),
    damage: {
      ...defaultActivity.damage,
      includeBase: false,
    },
    range: {
      ...defaultActivity.range,
      value: weapon.system.range.reach,
    },
  }

  await weapon.createActivity('attack', offhandActivitySettings, { renderSheet: false })
}
