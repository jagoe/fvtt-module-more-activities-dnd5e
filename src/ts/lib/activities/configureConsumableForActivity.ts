import { createConsumableForWeapon, getConsumableForWeapon } from '../foundry'

export const configureConsumableForActivity = async (weapon: Item, activity?: Activity) => {
  const consumable = getConsumableForWeapon(weapon) ?? (await createConsumableForWeapon(weapon))

  if (!activity || !consumable?.id) {
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
