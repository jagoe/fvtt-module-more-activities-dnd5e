import { dnd5eDefaultActivityKey, MadActivityKey } from '@/constants'
import { NoDefaultActivityError } from '@/models'
import { getDefaultActivity } from './getDefaultActivity'
import { createConsumableForWeapon, i18n } from '../foundry'
import { getConsumableForWeapon } from '../foundry/getConsumableForWeapon'

// TODO: The different activity methods share a huge amount of code and can be abstracted

export const hasOffhandThrownAttack = (weapon: Item) =>
  weapon.system.activities.has(MadActivityKey.OffhandThrownActivityKey)

export const addOffhandThrownAttack = async (weapon: Item) => {
  if (hasOffhandThrownAttack(weapon)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    throw new NoDefaultActivityError(weapon)
  }
  const basicActicitySettings: Activity = {
    ...defaultActivity,
    _id: MadActivityKey.OffhandThrownActivityKey,
    name: i18n('MAD.activities.offhand-throw.name'),
  }

  const offhandThrownActivitySettings: Partial<Activity> = {
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
  }

  await weapon.createActivity(
    'attack',
    { ...basicActicitySettings, ...offhandThrownActivitySettings },
    { renderSheet: false },
  )

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
