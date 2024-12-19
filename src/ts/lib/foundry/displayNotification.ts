import { i18n } from './i18n'

type notificationType = 'info' | 'error' | 'warn'

export const displayNotification = (
  text: string,
  options?: Notifications.NotifyOptions & { type?: notificationType },
) => (ui.notifications as Notifications)[options?.type ?? 'info'](options?.localize ? i18n(text) : text, {...options, localize: false})
