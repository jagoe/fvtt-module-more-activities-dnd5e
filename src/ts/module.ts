// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/style.scss'
import { addWeaponTagActivities, resetActivities } from './lib/activities'
import { moduleId } from './constants'
import { MadSettings, onRenderSettingsConfig, registerSettings } from './settings'
import { debug } from './lib/util/debug'
import { getAllActorWeapons, loadSetting } from './lib/foundry'
import { removeLinkedConsumables } from './lib/activities/removeLinkedConsumables'

export interface MoreActivitiesModule extends Module {
  API: {
    addWeaponTagActivities: typeof addWeaponTagActivities
    removeWeaponTagActivities: typeof resetActivities
    removeConsumables: typeof removeLinkedConsumables
  }
  settings: {
    debugLog: boolean
    generateConsumables: boolean
    ignoreNPCs: boolean
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

Hooks.once('ready', async () => {
  await initializeActivities()
  addActivitiesToNewItems()
})

const initializeModule = () => {
  madModule = game.modules?.get(moduleId) as MoreActivitiesModule

  // Needs to be initialized first b/c loadSetting actually requires this to exist
  madModule.settings = {
    debugLog: false,
    generateConsumables: false,
    ignoreNPCs: false,
  }

  madModule.API = {
    addWeaponTagActivities,
    removeWeaponTagActivities: resetActivities,
    removeConsumables: removeLinkedConsumables,
  }
}

const configureModule = () => {
  madModule.settings.debugLog = loadSetting(MadSettings.DebugLogMessages, false)
  madModule.settings.generateConsumables = loadSetting(MadSettings.ExperimentalGenerateConsumables, false)
  madModule.settings.ignoreNPCs = loadSetting(MadSettings.IgnoreNpcs, false)
}

const initializeActivities = async () => {
  const resetOnLoad = loadSetting<boolean>(MadSettings.DebugResetMadActivitiesOnLoad, false)
  if (resetOnLoad) {
    debug('Deleting all existing weapon actvities created by this module')
    await madModule.API.removeWeaponTagActivities()
  }

  debug('Creating weapon activities for all light, versatile, and thrown weapons')
  await madModule.API.addWeaponTagActivities()

  if (!madModule.settings.generateConsumables) {
    await madModule.API.removeConsumables()
  }
}

const addActivitiesToNewItems = () => {
  Hooks.on('createActor', (actor: Actor) => {
    if (!actor.isOwner) {
      return
    }

    if (madModule.settings.ignoreNPCs && actor.type === 'npc') {
      return
    }

    const weapons = getAllActorWeapons(actor)
    addWeaponTagActivities(weapons)
  })

  Hooks.on('createItem', (item: Item) => {
    if (!item.isOwner) {
      return
    }

    if (item.type !== 'weapon') {
      return
    }

    if (madModule.settings.ignoreNPCs && (item.parent as Actor).type === 'npc') {
      return
    }

    addWeaponTagActivities([item])
  })
}
