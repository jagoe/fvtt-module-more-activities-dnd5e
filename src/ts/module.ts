// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/style.scss'
import { addWeaponTagActivities, resetActivities } from './lib/activities'
import { moduleId } from './constants'
import { MadSettings, onRenderSettingsConfig, registerSettings } from './settings'
import { debug } from './lib/util/debug'
import { getAllActorWeapons, loadSetting } from './lib/foundry'

export interface MoreActivitiesModule extends Module {
  API: {
    addWeaponTagActivities: typeof addWeaponTagActivities
    removeWeaponTagActivities: typeof resetActivities
  }
  settings: {
    debugLog?: boolean
  }
}

export let madModule: MoreActivitiesModule

Hooks.once('init', async () => {
  console.log(`Initializing ${moduleId}`)

  initializeModule()
  registerSettings(madModule)
  configureModule()

  Hooks.on('renderSettingsConfig', onRenderSettingsConfig)
})

Hooks.once('ready', () => {
  // We're not awaiting this on purpose, as this shouldn't block anything
  initializeActivities()
  addActivitiesToNewItems()
})

const initializeModule = () => {
  madModule = game.modules?.get(moduleId) as MoreActivitiesModule

  madModule.settings = {
    debugLog: false, // Needs to be initialized first b/c loadSetting actually requires this to exist
  }

  madModule.API = {
    addWeaponTagActivities,
    removeWeaponTagActivities: resetActivities,
  }
}

const configureModule = () => {
  madModule.settings.debugLog = loadSetting(MadSettings.LogDebugMessages, false)
}

const initializeActivities = async () => {
  const resetOnLoad = loadSetting<boolean>(MadSettings.ResetMadActivitiesOnLoad, false)
  if (resetOnLoad) {
    debug('Deleting all existing weapon actvities created by this module')
    await madModule.API.removeWeaponTagActivities()
  }

  debug('Creating weapon activities for all light, versatile, and thrown weapons')
  await madModule.API.addWeaponTagActivities()
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
