import { getAllActorWeapons } from './getAllActorWeapons'

export const getAllOwnedWeapons = () => {
  return [...game.actors].filter((actor) => actor.isOwner).flatMap((actor) => getAllActorWeapons(actor))
}
