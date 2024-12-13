import { moduleId } from '@/constants'
import { debug } from '../util/debug'
import { MadSettings } from '@/settings'

/**
 * Loads a setting from the world/client settings
 * @param key The key of the setting to load
 * @param defaultValue The default value to return if the setting is not found
 * @returns The setting value
 */
export const loadSetting = <T>(key: MadSettings, defaultValue: T): T => {
  const setting = game.settings?.get(moduleId, key) as T | undefined

  debug(`Loaded setting: ${key} with value:`, setting)
  return setting ?? defaultValue
}
