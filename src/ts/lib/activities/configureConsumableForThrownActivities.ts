import { MadActivityKey } from '@/constants'
import { createConsumableForWeapon, getConsumableForWeapon } from '../foundry'
import { debug } from '../util/debug'

export const configureConsumableForThrownActivities = async (weapons: Item[]) => {
  const relevantActivityKeys: string[] = [MadActivityKey.ThrownActivityKey, MadActivityKey.OffhandThrownActivityKey]
  const relevantActivities = weapons
    .flatMap((w) => [...w.system.activities])
    .filter((a) => relevantActivityKeys.includes(a.id))

  const consumables = new Set<Item>()
  for (const weapon of weapons) {
    const consumable = await getOrCreateConsumable(weapon)

    if (!consumable) {
      continue
    }

    consumables.add(consumable)
  }

  return await Promise.all(
    relevantActivities.map((activity) => configureConsumableForThrownActivity(activity, consumables)),
  )
}

const getOrCreateConsumable = async (weapon: Item) => {
  const existingConsumable = getConsumableForWeapon(weapon)

  if (existingConsumable) {
    debug(`Found existing consumable for ${weapon.name}: ${existingConsumable.id}`)
    return existingConsumable
  }

  const newConsumable = await createConsumableForWeapon(weapon)

  debug(`Created new consumable for ${weapon.name}: ${newConsumable?.id ?? '<null>'}`)

  return newConsumable
}

const configureConsumableForThrownActivity = async (activity: Activity, consumables: Set<Item>) => {
  const weapon = activity.parent.parent
  const consumable = consumables.find((c) => c.name === weapon.name)

  if (!consumable?.id) {
    debug(`Did not find consumable for ${weapon.name} (${activity.name}) [${weapon.id}]`)
    return
  }

  const consumptionTargets: ConsumptionTargetSchema[] = [
    {
      type: 'material',
      target: consumable.id,
      value: '1',
    },
  ]
  await activity.update({ 'consumption.targets': consumptionTargets })
}
