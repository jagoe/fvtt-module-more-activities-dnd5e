import { logPrefix } from '@/constants'
import { i18n } from '@/lib/foundry'

export class NoDefaultActivityError extends Error {
  constructor(item: Item) {
    super()

    this.message = `${logPrefix} ${i18n('MAD.errors.noDefaultActivity', { item })}`
  }
}
