export const createConsumableForWeapon = async (weapon: Item) => {
  const actor = weapon.parent as Actor

  if (!actor) {
    return null
  }

  const consumableData: Partial<Item> = {
    type: 'consumable',
    name: weapon.name,
    img: weapon.img,
    system: {
      description: weapon.system.description,
    } as ItemSystemProperties,
  }

  const createdDocuments = await actor.createEmbeddedDocuments('Item', [consumableData])
  if (!createdDocuments) {
    return null
  }

  return createdDocuments[0]
}
