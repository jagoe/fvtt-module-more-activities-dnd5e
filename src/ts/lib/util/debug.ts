import { logPrefix } from '@/constants'

export const debug = (...args: unknown[]) => console.debug(logPrefix, 'DEBUG |', ...args)
