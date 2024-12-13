import { MadActivityKey } from '@/constants'
import { addWeaponTagActivity } from './addWeaponTagActivity'
import { configureConsumableForActivity } from './configureConsumableForActivity'

export const addThrownAttack = async (weapon: Item) => {
  const result = await addWeaponTagActivity({
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

  if (!result) {
    // Already processed, nothing to do
    return
  }

  const { activity } = result

  // Configure consumption of the weapon's consumable
  await configureConsumableForActivity(weapon, activity)
}
