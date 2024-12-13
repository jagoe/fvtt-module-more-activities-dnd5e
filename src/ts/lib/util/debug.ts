import { logPrefix } from '@/constants'
import { madModule } from '@/module'

export const debug = (...args: unknown[]) => {
  if (!madModule.settings.debugLog) {
    return
  }

  console.debug(logPrefix, 'DEBUG |', ...args)
}
