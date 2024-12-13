import { MadActivityKey } from '@/constants'
import { getDefaultActivity } from './getDefaultActivity'
import { NoDefaultActivityError } from '@/models'
import { i18n } from '../foundry'

export const hasThrownAttack = (weapon: Item) => weapon.system.activities.has(MadActivityKey.ThrownActivityKey)

export const addThrownAttack = async (weapon: Item) => {
  if (hasThrownAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }

  const thrownActivitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.ThrownActivityKey,
    name: i18n('MAD.activities.thrown.name'),
    attack: {
      ...defaultActivity.attack,
      type: {
        ...defaultActivity.attack.type,
        value: 'ranged',
      },
    },
  }

  await weapon.createActivity('attack', thrownActivitySettings, { renderSheet: false })
}
