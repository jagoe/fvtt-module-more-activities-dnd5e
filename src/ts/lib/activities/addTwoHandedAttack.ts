import { dnd5eDefaultActivityKey, MadActivityKey } from '@/constants'
import { getDefaultActivity } from './getDefaultActivity'
import { NoDefaultActivityError } from '@/models'
import { i18n } from '../foundry'

export const hasTwoHandedAttack = (weapon: Item) => weapon.system.activities.has(MadActivityKey.TwoHandedActivityKey)

export const addTwoHandedAttack = async (weapon: Item) => {
  if (hasTwoHandedAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }

  const weaponVersatileDamage = weapon.system.damage.versatile

  const twoHandedActivitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.TwoHandedActivityKey,
    name: i18n('MAD.activities.twohand.name'),
    damage: {
      ...defaultActivity.damage,
      parts: defaultActivity.damage.parts.map((part) => {
        if (!part.base) {
          return part
        }

        return {
          ...part,
          number: weaponVersatileDamage.number,
          denomination: weaponVersatileDamage.denomination + 2,
          weaponVersatileDamage: weaponVersatileDamage.bonus + ' + @mod',
          types: weaponVersatileDamage.types,
        }
      }),
      includeBase: false,
    },
    range: {
      ...defaultActivity.range,
      value: weapon.system.range.reach,
    },
  }

  await weapon.createActivity('attack', twoHandedActivitySettings, { renderSheet: false })
  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    name: i18n('MAD.activities.oneHanded.name'),
  })
}
