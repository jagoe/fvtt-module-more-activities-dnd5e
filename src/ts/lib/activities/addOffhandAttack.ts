import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addOffhandAttack = async (weapon: Item): Promise<{error?: string} | undefined> =>
  addWeaponTagActivity({
    weapon,
    key: MadActivityKey.OffhandActivityKey,
    labelI18nKey: 'MAD.activities.offhand.name',
    getAdjustments: (defaultActivity) => {
      const weaponBaseDamage = weapon.system.damage.base

      return {
        damage: {
          ...defaultActivity.damage,
          includeBase: false,
          parts: [
            ...defaultActivity.damage.parts.filter((part) => !part.base),
            {
              number: weaponBaseDamage.number,
              denomination: weaponBaseDamage.denomination,
              bonus: weaponBaseDamage.bonus + (weapon.system.magicalBonus ?? 0), // Leave out @mod
              types: weaponBaseDamage.types,
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
