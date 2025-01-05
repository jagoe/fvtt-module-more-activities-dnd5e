import { MadActivityKey } from '@/constants'
import { getDefaultActivity } from './getDefaultActivity'
import { i18n } from '../foundry'
import { hasWeaponTagActivity } from './hasWeaponTagActivity'
import { makeDefaultActivityMeleeRange } from './makeDefaultActivityMeleeRange'

export type AddWeaponTagActivityProps = {
  weapon: Item
  key: MadActivityKey
  labelI18nKey: string
  getAdjustments: (defaultActivity: Activity) => Partial<Activity>
}

export const addWeaponTagActivity = async ({
  weapon,
  key,
  labelI18nKey,
  getAdjustments,
}: AddWeaponTagActivityProps) => {
  if (hasWeaponTagActivity(weapon, key)) {
    return
  }

  const defaultActivity = getDefaultActivity(weapon)
  if (!defaultActivity) {
    const actor = weapon.parent
    return {error: i18n('MAD.errors.noDefaultActivity', { item: weapon.name, actor: actor.name })}
  }
  const basicActicitySettings: Activity = {
    ...defaultActivity,
    _id: key,
    name: i18n(labelI18nKey),
  }

  await weapon.createActivity(
    'attack',
    { ...basicActicitySettings, ...getAdjustments(defaultActivity) },
    { renderSheet: false },
  )

  const activity = weapon.system.activities.get(key)

  // Make sure the weapon's default range is it's close combat range
  await makeDefaultActivityMeleeRange(weapon, defaultActivity)

  return { activity, defaultActivity }
}
