export const i18n = (i18nId: string, data?: Record<string, unknown>) =>
  game.i18n?.format(i18nId, data) ?? '<Trying to localize before module initialization finished>'
