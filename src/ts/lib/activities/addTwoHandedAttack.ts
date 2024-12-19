import { dnd5eDefaultActivityKey, MadActivityKey } from '@/constants'
import { i18n } from '../foundry'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addTwoHandedAttack = async (weapon: Item): Promise<{error?: string} | undefined> => {
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
          includeBase: false,
          parts: [
            ...defaultActivity.damage.parts.filter((part) => !part.base),
            // Same damage as default activity, but default to weapon's versatile data where available
            {
              number: weaponVersatileDamage.number || weaponBaseDamage.number,
              // Fallback to increasing dice denomination by 2 (e.g. d8 to d10)
              denomination: weaponVersatileDamage.denomination || weaponBaseDamage.denomination + 2,
              bonus:
                (weaponVersatileDamage.bonus || weaponBaseDamage.bonus) + '@mod + ' + (weapon.system.magicalBonus ?? 0),
              types: weaponVersatileDamage.types.size ? weaponVersatileDamage.types : weaponBaseDamage.types,
              scaling: {
                number: 1,
              },
            },
          ],
        },
        range: {
          ...defaultActivity.range,
          value: weapon.system.range.reach,
        },
      }
    },
  })

  if (!result || result.error) {
    // Already processed or couldn't process
    return result
  }

  // Update original attack name to reflect that it is one-handed
  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    name: i18n('MAD.activities.oneHanded.name'),
  })

  return
}
