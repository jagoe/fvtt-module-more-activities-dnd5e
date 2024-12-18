import { warn } from '../util/warn'

export const createConsumableForWeapon = async (weapon: Item): Promise<Item | null> => {
  const actor = weapon.parent as Actor

  if (!actor) {
    warn(`Could not find actor owning item ${weapon.name} (${weapon.id})`)
    return null
  }

  const consumableData: Partial<Item> = {
    type: 'consumable',
    name: weapon.name,
    img: weapon.img,
    system: {
      description: weapon.system.description,
      weight: weapon.system.weight,
      quantity: weapon.system.quantity,
    } as ItemSystemProperties,
  }

  const createdDocuments = await actor.createEmbeddedDocuments('Item', [consumableData])
  if (!createdDocuments) {
    warn(`Could not create consumable for item ${weapon.name} (${weapon.id}) on actor ${actor.name} (${actor.id})`)
    return null
  }

  await weapon.update({
    'system.weight.value': 0,
    'system.quantity': 1,
  })

  return createdDocuments[0] as Item
}
