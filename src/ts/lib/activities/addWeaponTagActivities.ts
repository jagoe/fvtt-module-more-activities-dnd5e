import { displayNotification, getAllOwnedWeapons } from '@/lib/foundry'
import { addOffhandAttack } from './addOffhandAttack'
import { addThrownAttack } from './addThrowAttack'
import { addTwoHandedAttack } from './addTwoHandedAttack'
import { addOffhandThrownAttack } from './addOffhandThrownAttack'
import { Dnd5eItemProperty } from '@/models'
import { debug } from '../util/debug'
import { hasWeaponTagActivity } from './hasWeaponTagActivity'
import { logPrefix, MadActivityKey } from '@/constants'
import { madModule } from '@/module'
import { configureConsumableForThrownActivities } from './configureConsumableForThrownActivities'

export const addWeaponTagActivities = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const createOffhand = madModule.settings.enabledActivities.offhand
  const createThrown = madModule.settings.enabledActivities.thrown
  const createOffhandThrow = madModule.settings.enabledActivities.offhandThrown
  const createTwoHanded = madModule.settings.enabledActivities.twoHanded

  let light: Item[]
  if (createOffhand || createOffhandThrow) {
    light = weapons.filter(
      (weapon) =>
        weapon.system.properties.has(Dnd5eItemProperty.Light) &&
        !hasWeaponTagActivity(weapon, MadActivityKey.OffhandActivityKey),
    )

    debug(
      'Light weapons newly configured to have offhand attack:',
      light.map((weapon) => ({ id: weapon.id, name: weapon.name })),
    )
  } else {
    light = []
  }

  let thrown: Item[]
  if (createThrown || createOffhandThrow) {
    thrown = weapons.filter(
      (weapon) =>
        weapon.system.properties.has(Dnd5eItemProperty.Thrown) &&
        !hasWeaponTagActivity(weapon, MadActivityKey.ThrownActivityKey),
    )
    debug(
      'Thrown weapons newly configured to have throw attack:',
      thrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
    )
  } else {
    thrown = []
  }

  let lightThrown: Item[]
  if (createOffhandThrow) {
    lightThrown = light.filter(
      (weapon) => thrown.includes(weapon) && !hasWeaponTagActivity(weapon, MadActivityKey.OffhandThrownActivityKey),
    )
    debug(
      'Light, thrown weapons newly configured to have offhand throw attack:',
      lightThrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
    )
  } else {
    lightThrown = []
  }

  let versatile: Item[]
  if (createTwoHanded) {
    versatile = weapons.filter(
      (weapon) =>
        weapon.system.properties.has(Dnd5eItemProperty.Versatile) &&
        !hasWeaponTagActivity(weapon, MadActivityKey.TwoHandedActivityKey),
    )
    debug(
      'Versatile weapons newly configured to have two-handed attack:',
      versatile.map((weapon) => ({ id: weapon.id, name: weapon.name })),
    )
  } else {
    versatile = []
  }

  const results = await Promise.all([
    ...(createOffhand ? light.map(addOffhandAttack) : []),
    ...(createThrown ? thrown.map(addThrownAttack) : []),
    ...(createOffhandThrow ? lightThrown.map(addOffhandThrownAttack) : []),
    ...(createTwoHanded ? versatile.map(addTwoHandedAttack) : []),
  ])

  const errors = new Set(results.filter(result => !!result?.error).map(result => result!.error!))
  if (errors.size) {
    errors.forEach(error => displayNotification(`${logPrefix} ${error}`, {type: 'warn', permanent: true}))
  }

  // Configure consumption of the weapon's consumable
  if (madModule.settings.generateConsumables && (createThrown || createOffhandThrow)) {
    await configureConsumableForThrownActivities(createThrown ? thrown : lightThrown)
  }
}
