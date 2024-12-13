import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'
import { configureConsumableForActivity } from './configureConsumableForActivity'

export const addOffhandThrownAttack = async (weapon: Item) => {
  const result = await addWeaponTagActivity({
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

  if (!result) {
    // Already processed, nothing to do
    return
  }

  const { activity } = result

  // Configure consumption of the weapon's consumable
  await configureConsumableForActivity(weapon, activity)
}
