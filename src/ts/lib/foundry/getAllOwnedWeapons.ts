import { madModule } from '@/module'
import { getAllActorWeapons } from './getAllActorWeapons'

export const getAllOwnedWeapons = () => {
  const gameActors = [...game.actors]
  const allSceneActors = [...game.scenes].flatMap((scene) =>
    scene.tokens
      .filter((token) => !token.actorLink)
      .map((token) => token.actor)
      .filter((actor) => actor !== null),
  )
  const allActors = [...gameActors, ...allSceneActors]
  const uniqueActors = [...new Map(allActors.map((actor) => [actor.uuid, actor])).values()]

  const relevantActors = uniqueActors.filter(
    (actor) => actor.isOwner && (!madModule.settings.ignoreNPCs || actor.type !== 'npc'),
  )

  return relevantActors.flatMap((actor) => getAllActorWeapons(actor))
}
