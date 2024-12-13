import { MadActivityKey } from '@/constants'
import { NoDefaultActivityError } from '@/models'
import { getDefaultActivity } from './getDefaultActivity'
import { i18n } from '../foundry'

export const hasOffhandThrownAttack = (weapon: Item) =>
  weapon.system.activities.has(MadActivityKey.OffhandThrownActivityKey)

export const addOffhandThrownAttack = async (weapon: Item) => {
  if (hasOffhandThrownAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }

  const offhandThrownActivitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.OffhandThrownActivityKey,
    name: i18n('MAD.activities.offhand-throw.name'),
    attack: {
      ...defaultActivity.attack,
      type: {
        ...defaultActivity.attack.type,
        value: 'ranged',
      },
    },
    damage: {
      ...defaultActivity.damage,
      includeBase: false,
    },
  }

  await weapon.createActivity('attack', offhandThrownActivitySettings, { renderSheet: false })
}
