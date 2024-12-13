import { id } from '../../module.json'

export const moduleId = id
export const logPrefix = 'Module More Activities dnd5e |'

export const dnd5eDefaultActivityKey = 'dnd5eactivity000'

export enum MadActivityKey {
  OffhandActivityKey = 'extactivityoff00',
  ThrownActivityKey = 'extactivitythr00',
  TwoHandedActivityKey = 'extactivitytwo00',
  OffhandThrownActivityKey = 'extactivityoht00',
}

export const madActivityKeys: string[] = Object.values(MadActivityKey)
