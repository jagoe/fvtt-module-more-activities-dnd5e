import { MadActivityKey } from '@/constants'
import { Dnd5eItemProperty } from '@/models'
import '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/head'

declare global {
  interface Game {
    actors: Actor[]
  }

  interface Actor {
    items: Item[]
  }

  interface Item {
    name: string
    type: Dnd5eItemType
    system: ItemSystemProperties
    createActivity(type: 'attack', activity: Activity, options: { renderSheet: boolean })
    updateActivity(key: string, activity: Partial<Activity>)
  }

  interface ItemSystemProperties {
    activities: Collection<Activity>
    properties: Collection<Dnd5eItemProperty>
    damage: {
      base: WeaponDamage
      versatile: WeaponDamage
    }
    range: {
      value: number
      long: number
      reach: number
      units: string
    }
  }

  interface WeaponDamage {
    number: number
    denomination: number
    types: Set<string>
    bonus: string
  }

  interface Activity {
    _id: string
    id: string | MadActivityKey
    parent: Item
    name: string
    attack: ActivityAttack
    damage: ActivityDamage
    range: ActivityRange
  }

  interface ActivityAttack {
    type: {
      value: 'melee' | 'ranged'
      classification: string
    }
  }

  interface ActivityDamage {
    includeBase: false
    critical: {
      bonus: string
    }
    parts: ActivityDamagePart[]
  }

  interface ActivityRange {
    canOverride: boolean
    override: boolean
    scalar: boolean
    special: string
    units: string
    value: number
  }

  interface ActivityDamagePart {
    base: boolean
    number: number
    denomination: number
    bonus: string
    scaling: {
      mode: string
      number: number | null
      formula: string
    }
    types: Set<string>
    custom: {
      enabled: boolean
      formula: string
    }
  }

  type Dnd5eItemType =
    | 'weapon'
    | 'equipment'
    | 'consumable'
    | 'tool'
    | 'loot'
    | 'race'
    | 'background'
    | 'class'
    | 'subclass'
    | 'spell'
    | 'feat'
    | 'container'
    | 'backpack'
    | 'facility'

  let game: Game
}
