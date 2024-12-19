import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addOffhandThrownAttack = (weapon: Item): Promise<{error?: string} | undefined> =>
  addWeaponTagActivity({
    weapon,
    key: MadActivityKey.OffhandThrownActivityKey,
    labelI18nKey: 'MAD.activities.offhand-throw.name',
    getAdjustments: (defaultActivity) => {
      const weaponBaseDamage = weapon.system.damage.base

      return {
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
          value: weapon.system.range.value,
        },
      }
    },
  })
