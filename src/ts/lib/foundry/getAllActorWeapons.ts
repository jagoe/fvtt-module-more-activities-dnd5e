export const getAllActorWeapons = (actor: Actor) => {
  if (!actor.isOwner) {
    return []
  }

  return [...actor.items].filter((item) => item.type === 'weapon')
}
