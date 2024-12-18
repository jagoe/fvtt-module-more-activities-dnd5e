import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addOffhandThrownAttack = (weapon: Item) =>
  addWeaponTagActivity({
    weapon,
    key: MadActivityKey.OffhandThrownActivityKey,
    labelI18nKey: 'MAD.activities.offhand-throw.name',
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
        includeBase: false,
      },
      range: {
        ...defaultActivity.range,
        value: weapon.system.range.value,
      },
    }),
  })
