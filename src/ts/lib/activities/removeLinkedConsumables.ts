import { MadActivityKey } from '@/constants'
import { getAllOwnedWeapons, getConsumableForWeapon } from '../foundry'
import { warn } from '../util/warn'
import { debug } from '../util/debug'

type ConsumableWeaponMap = {
  consumable: Item
  weapon: Item
}

type RemoveConsumableData = {
  actor: Actor
  consumables: Map<string, ConsumableWeaponMap>
}

export const removeLinkedConsumables = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const relevantActivityKeys: string[] = [MadActivityKey.ThrownActivityKey, MadActivityKey.OffhandThrownActivityKey]
  const relevantActivities = weapons
    .flatMap((w) => [...w.system.activities])
    .filter((a) => relevantActivityKeys.includes(a.id))

  const toRemove = new Map<string, RemoveConsumableData>()
  for (const activity of relevantActivities) {
    debug(`Removing consumables for ${activity.parent.parent.name}`)

    const consumableIds = activity.consumption.targets.map((t) => t.target).filter((id) => !!id)
    const weapon: Item = activity.parent.parent
    const actor: Actor = weapon.parent

    if (!actor.id) {
      warn(`Could not remove activity from an actor for activity '${activity.id}': Actor doesn't have an id`)
      continue
    }

    if (!toRemove.has(actor.id)) {
      toRemove.set(actor.id, {
        actor,
        consumables: new Map<string, ConsumableWeaponMap>(),
      })
    }

    const actorConsumables = toRemove.get(actor.id)!.consumables

    consumableIds.forEach((id) => {
      const consumable = getConsumableForWeapon(weapon)
      if (!consumable) {
        return
      }

      actorConsumables.set(id, {
        weapon,
        consumable,
      })
    })
  }

  await Promise.all(
    toRemove
      .values()
      .filter(({ consumables }) => consumables.size)
      .map(async ({ actor, consumables }) => {
        const consumableIds = consumables.keys()

        await Promise.all(
          consumables.values().map(({ consumable, weapon }) =>
            weapon.update({
              'system.weight.value': consumable.system.weight.value,
              'system.quantity': consumable.system.quantity,
            }),
          ),
        )

        await actor.deleteEmbeddedDocuments('Item', [...consumableIds]).catch(() => {
          warn(`Actor ${actor.name} doesn't have the linked consumable (${[...consumableIds]})`)
        })
      }),
  )
}
