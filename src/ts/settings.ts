import { moduleId } from './constants'
import { addWeaponTagActivities, resetActivities } from './lib/activities'
import { removeLinkedConsumables } from './lib/activities/removeLinkedConsumables'
import { i18n, displayNotification } from './lib/foundry'
import { MoreActivitiesModule } from './module'

export enum MadSettings {
  IgnoreNpcs = 'IgnoreNpcs',
  CreateOffhandActivites = 'CreateOffhandActivites',
  CreateThrownActivites = 'CreateThrownActivites',
  CreateOffhandThrownActivites = 'CreateOffhandThrownActivites',
  CreateTwoHandActivites = 'CreateTwoHandActivites',
  ExperimentalGenerateConsumables = 'ExperimentalGenerateConsumables',
  DebugLogMessages = 'LogDebugMessages',
  DebugResetMadActivitiesOnLoad = 'ResetMadActivitiesOnLoad',
}

export const registerSettings = (module: MoreActivitiesModule) => {
  game.settings.register(moduleId, MadSettings.IgnoreNpcs, {
    name: i18n('MAD.settings.feature.ignoreNpcs.name'),
    hint: i18n('MAD.settings.feature.ignoreNpcs.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.CreateOffhandActivites, {
    name: i18n('MAD.settings.feature.createOffhand.name'),
    hint: i18n('MAD.settings.feature.createOffhand.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.CreateThrownActivites, {
    name: i18n('MAD.settings.feature.createThrown.name'),
    hint: i18n('MAD.settings.feature.createThrown.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.CreateOffhandThrownActivites, {
    name: i18n('MAD.settings.feature.createOffhandThrown.name'),
    hint: i18n('MAD.settings.feature.createOffhandThrown.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.CreateTwoHandActivites, {
    name: i18n('MAD.settings.feature.createTwoHand.name'),
    hint: i18n('MAD.settings.feature.createTwoHand.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.IgnoreNpcs, {
    name: i18n('MAD.settings.feature.ignoreNpcs.name'),
    hint: i18n('MAD.settings.feature.ignoreNpcs.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  })

  game.settings.register(moduleId, MadSettings.ExperimentalGenerateConsumables, {
    name: i18n('MAD.settings.experimental.generateConsumables.name'),
    hint: i18n('MAD.settings.experimental.generateConsumables.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: false,
    async onChange(value) {
      module.settings.generateConsumables = value

      if (!value) {
        await removeLinkedConsumables()
      }
    },
  })

  game.settings.register(moduleId, MadSettings.DebugLogMessages, {
    name: i18n('MAD.settings.debug.logDebugMessages.name'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: false,
    onChange: (value) => (module.settings.debugLog = value),
  })

  game.settings.register(moduleId, MadSettings.DebugResetMadActivitiesOnLoad, {
    name: i18n('MAD.settings.debug.resetOnLoad.name'),
    hint: i18n('MAD.settings.debug.resetOnLoad.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: false,
  })
}

export const onRenderSettingsConfig = () => {
  $('<p>')
    .addClass(['notification', 'info'])
    .text(i18n('MAD.settings.feature.hint'))
    .insertBefore($(`[name="${moduleId}.${MadSettings.IgnoreNpcs}"]`).parents('div.form-group:first'))

  $('<h3>')
    .addClass('border')
    .html(i18n('MAD.settings.experimental.title'))
    .insertBefore(
      $(`[name="${moduleId}.${MadSettings.ExperimentalGenerateConsumables}"]`).parents('div.form-group:first'),
    )

  $('<h3>')
    .addClass('border')
    .html(i18n('MAD.settings.debug.title'))
    .insertBefore($(`[name="${moduleId}.${MadSettings.DebugLogMessages}"]`).parents('div.form-group:first'))

  addConfigButton(
    i18n('MAD.settings.buttons.resetActivities.label'),
    i18n('MAD.settings.buttons.resetActivities.text'),
    async () => {
      await resetActivities()

      displayNotification('MAD.settings.buttons.resetActivities.success', { localize: true })
    },
  )

  addConfigButton(
    i18n('MAD.settings.buttons.createActivities.label'),
    i18n('MAD.settings.buttons.createActivities.text'),
    async () => {
      await addWeaponTagActivities()

      displayNotification('MAD.settings.buttons.createActivities.success', { localize: true })
    },
  )
}

const addConfigButton = (label: string, buttonText: string, buttonAction: () => void) => {
  const configSection = $(`section.category[data-category=${moduleId}]`)

  const formGroup = $('<div>').addClass('form-group submenu').appendTo(configSection)
  $('<label>').text(label).appendTo(formGroup)
  $('<button>')
    .text(buttonText)
    .on('click', (e) => {
      e.preventDefault()

      buttonAction()
    })
    .appendTo(formGroup)
}
