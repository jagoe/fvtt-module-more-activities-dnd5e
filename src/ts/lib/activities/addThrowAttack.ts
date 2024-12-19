import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addThrownAttack = (weapon: Item): Promise<{error?: string} | undefined> =>
  addWeaponTagActivity({
    weapon,
    key: MadActivityKey.ThrownActivityKey,
    labelI18nKey: 'MAD.activities.thrown.name',
    getAdjustments: (defaultActivity) => ({
      attack: {
        ...defaultActivity.attack,
        type: {
          ...defaultActivity.attack.type,
          value: 'ranged',
        },
      },
      damage: {
        ...defaultActivity.damage,
        includeBase: true,
        parts: [],
      },
      range: {
        ...defaultActivity.range,
        value: weapon.system.range.value,
      },
    }),
  })
