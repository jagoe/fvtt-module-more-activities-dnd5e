// Do not remove this import. If you do Vite will think your styles are dead
// code and not include them in the build output.
import '../styles/style.scss'
import { moduleId } from './constants'
import { registerSettings } from './settings'

export interface MoreActivitiesModule extends Module {}

let module: MoreActivitiesModule

Hooks.once('init', () => {
  console.log(`Initializing ${moduleId}`)

  registerSettings(module)

  module = game.modules?.get(moduleId) as MoreActivitiesModule
})
