import { dnd5eDefaultActivityKey, MadActivityKey } from '@/constants'
import { getDefaultActivity } from './getDefaultActivity'
import { NoDefaultActivityError } from '@/models'
import { createConsumableForWeapon, i18n } from '../foundry'
import { getConsumableForWeapon } from '../foundry/getConsumableForWeapon'

export const hasThrownAttack = (weapon: Item) =>
  weapon.system.activities.has(MadActivityKey.ThrownActivityKey) && hasConsumable(weapon)

const hasConsumable = (weapon: Item) =>
  (weapon.parent as Actor).items.some((item) => item.type === 'consumable' && item.name === weapon.name)

export const addThrownAttack = async (weapon: Item) => {
  if (hasThrownAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }

  const basicActicitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.ThrownActivityKey,
    name: i18n('MAD.activities.thrown.name'),
  }

  const thrownActivitySettings: Partial<Activity> = {
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
  }

  await weapon.createActivity('attack', { ...basicActicitySettings, ...thrownActivitySettings }, { renderSheet: false })

  const activity = weapon.system.activities.get(MadActivityKey.ThrownActivityKey)
  const consumable = getConsumableForWeapon(weapon) ?? (await createConsumableForWeapon(weapon))
  if (activity && consumable?.id) {
    const consumptionTargets: ConsumptionTargetSchema[] = [
      {
        type: 'material',
        target: consumable.id,
        value: '1',
      },
    ]
    await activity.update({ 'consumption.targets': consumptionTargets })
  }

  await weapon.updateActivity(dnd5eDefaultActivityKey, {
    range: {
      ...defaultActivity.range,
      override: true,
      value: weapon.system.range.reach,
    },
  })
}
