import { moduleId } from './constants'
import { addWeaponTagActivities } from './lib/activities/addWeaponTagActivities'
import { resetActivities } from './lib/activities/resetActivities'
import { i18n, displayNotification } from './lib/foundry'

export enum MadSettings {
  ResetMadActivitiesOnLoad = 'ResetMadActivitiesOnLoad',
}

export const registerSettings = () => {
  //#region World settings

  game.settings.register(moduleId, MadSettings.ResetMadActivitiesOnLoad, {
    name: i18n('MAD.settings.resetOnLoad.name'),
    hint: i18n('MAD.settings.resetOnLoad.hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
    requiresReload: false,
  })

  //#endregion

  //#region Client settings
  //#endregion
}

export const onRenderSettingsConfig = () => {
  const configSection = $(`section.category[data-category=${moduleId}]`)

  $('<h3>')
    .addClass('border')
    .html(i18n('MAD.settings.sections.debug'))
    .insertBefore($(`[name="${moduleId}.${MadSettings.ResetMadActivitiesOnLoad}"]`).parents('div.form-group:first'))

  $('<div>').addClass('form-group').appendTo(configSection).append()

  addConfigButton(
    i18n('MAD.settings.buttons.resetActivities.label'),
    i18n('MAD.settings.buttons.resetActivities.text'),
    async () => {
      await resetActivities()

      displayNotification('MAD.settings.buttons.resetActivities.success', { i18n: true })
    },
  )

  addConfigButton(
    i18n('MAD.settings.buttons.createActivities.label'),
    i18n('MAD.settings.buttons.createActivities.text'),
    async () => {
      await addWeaponTagActivities()

      displayNotification('MAD.settings.buttons.createActivities.success', { i18n: true })
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
