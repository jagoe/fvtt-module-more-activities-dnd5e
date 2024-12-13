// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/style.scss'
import { addOffhandAttack } from './lib/activities'
import { addThrownAttack } from './lib/activities/addThrowAttack'
import { addTwoHandedAttack } from './lib/activities/addTwoHandedAttack'
import { addWeaponTagActivities } from './lib/activities/addWeaponTagActivities'
import { resetActivities } from './lib/activities/resetActivities'
import { moduleId } from './constants'
import { MadSettings, onRenderSettingsConfig, registerSettings } from './settings'
import { debug } from './lib/util/debug'
import { getAllActorWeapons, loadSetting } from './lib/foundry'

export interface MoreActivitiesModule extends Module {
  API: {
    addWeaponTagActivities: typeof addWeaponTagActivities
    addOffhandAttack: typeof addOffhandAttack
    addThrownAttack: typeof addThrownAttack
    addTwoHandedAttack: typeof addTwoHandedAttack
    removeWeaponTagActivities: typeof resetActivities
  }
}

let module: MoreActivitiesModule

Hooks.once('init', async () => {
  console.log(`Initializing ${moduleId}`)

  registerSettings()
  Hooks.on('renderSettingsConfig', onRenderSettingsConfig)

  module = game.modules?.get(moduleId) as MoreActivitiesModule

  module.API = {
    addWeaponTagActivities,
    addOffhandAttack,
    addThrownAttack,
    addTwoHandedAttack,
    removeWeaponTagActivities: resetActivities,
  }
})

Hooks.once('ready', () => {
  // We're not awaiting this on purpose, as this shouldn't block anything
  initializeActivities()
  addActivitiesToNewItems()
})

const initializeActivities = async () => {
  const resetOnLoad = loadSetting<boolean>(MadSettings.ResetMadActivitiesOnLoad, false)
  if (resetOnLoad) {
    debug('Deleting all existing weapon actvities created by this module')
    await module.API.removeWeaponTagActivities()
  }

  debug('Creating weapon activities for all light, versatile, and thrown weapons')
  await module.API.addWeaponTagActivities()
}

const addActivitiesToNewItems = () => {
  Hooks.on('createActor', (actor: Actor) => {
    if (!actor.isOwner) {
      return
    }

    const weapons = getAllActorWeapons(actor)
    addWeaponTagActivities(weapons)
  })

  Hooks.on('createItem', (item: Item) => {
    if (!item.isOwner) {
      return
    }

    addWeaponTagActivities([item])
  })
}
