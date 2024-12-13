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
  const weaponBaseDamage = weapon.system.damage.base

  const baseActivitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.TwoHandedActivityKey,
    name: i18n('MAD.activities.twohand.name'),
  }

  const twoHandedActivitySettings: Partial<Activity> = {
    damage: {
      ...defaultActivity.damage,
      parts: [
        ...defaultActivity.damage.parts.filter((part) => !part.base),
        {
          number: weaponVersatileDamage.number || weaponBaseDamage.number,
          denomination: weaponVersatileDamage.denomination || weaponBaseDamage.denomination + 2,
          bonus: (weaponVersatileDamage.bonus || weaponBaseDamage.bonus) + '@mod',
          types: weaponVersatileDamage.types.size ? weaponVersatileDamage.types : weaponBaseDamage.types,
          scaling: {
            number: 1,
          },
        },
      ],
      includeBase: false,
    },
    range: {
      ...defaultActivity.range,
      value: weapon.system.range.reach,
    },
  }

  await weapon.createActivity(
    'attack',
    { ...baseActivitySettings, ...twoHandedActivitySettings },
    { renderSheet: false },
  )

  // Update original attack name to reflect that it is one-handed
  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    name: i18n('MAD.activities.oneHanded.name'),
  })
}
