import { dnd5eDefaultActivityKey, MadActivityKey } from '@/constants'
import { i18n } from '../foundry'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addTwoHandedAttack = async (weapon: Item) => {
  const result = await addWeaponTagActivity({
    weapon,
    key: MadActivityKey.TwoHandedActivityKey,
    labelI18nKey: 'MAD.activities.twohand.name',
    getAdjustments: (defaultActivity) => {
      const weaponVersatileDamage = weapon.system.damage.versatile
      const weaponBaseDamage = weapon.system.damage.base

      return {
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
    },
  })

  if (!result) {
    // Already processed, nothing to do
    return
  }

  // Update original attack name to reflect that it is one-handed
  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    name: i18n('MAD.activities.oneHanded.name'),
  })
}
