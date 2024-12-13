import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'

export const addOffhandAttack = async (weapon: Item) =>
  addWeaponTagActivity({
    weapon,
    key: MadActivityKey.OffhandActivityKey,
    labelI18nKey: 'MAD.activities.offhand.name',
    getAdjustments: (defaultActivity) => ({
      damage: {
        ...defaultActivity.damage,
        includeBase: false,
      },
      range: {
        ...defaultActivity.range,
        value: weapon.system.range.reach,
      },
    }),
  })
