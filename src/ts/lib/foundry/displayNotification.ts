import { i18n } from './i18n'

type notificationType = 'info' | 'error' | 'warn'

export const displayNotification = (
  text: string,
  options?: Notifications.NotifyOptions & { type?: notificationType; i18n?: boolean },
) => (ui.notifications as Notifications)[options?.type ?? 'info'](options?.i18n ? i18n(text) : text, options)
