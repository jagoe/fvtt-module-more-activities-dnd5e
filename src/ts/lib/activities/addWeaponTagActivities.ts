import { getAllOwnedWeapons } from '@/lib/foundry'
import { addOffhandAttack } from './addOffhandAttack'
import { addThrownAttack } from './addThrowAttack'
import { addTwoHandedAttack } from './addTwoHandedAttack'
import { addOffhandThrownAttack } from './addOffhandThrownAttack'
import { Dnd5eItemProperty } from '@/models'
import { debug } from '../util/debug'
import { hasWeaponTagActivity } from './hasWeaponTagActivity'
import { MadActivityKey } from '@/constants'

export const addWeaponTagActivities = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const light = weapons.filter(
    (weapon) =>
      weapon.system.properties.has(Dnd5eItemProperty.Light) &&
      !hasWeaponTagActivity(weapon, MadActivityKey.OffhandActivityKey),
  )
  debug(
    'Light weapons newly configured to have offhand attack:',
    light.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const thrown = weapons.filter(
    (weapon) =>
      weapon.system.properties.has(Dnd5eItemProperty.Thrown) &&
      !hasWeaponTagActivity(weapon, MadActivityKey.ThrownActivityKey),
  )
  debug(
    'Thrown weapons newly configured to have throw attack:',
    thrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const lightThrown = light.filter(
    (weapon) => thrown.includes(weapon) && !hasWeaponTagActivity(weapon, MadActivityKey.OffhandThrownActivityKey),
  )
  debug(
    'Light, thrown weapons newly configured to have offhand throw attack:',
    lightThrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const versatile = weapons.filter(
    (weapon) =>
      weapon.system.properties.has(Dnd5eItemProperty.Versatile) &&
      !hasWeaponTagActivity(weapon, MadActivityKey.TwoHandedActivityKey),
  )
  debug(
    'Versatile weapons newly configured to have two-handed attack:',
    versatile.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  await Promise.all([
    ...light.map(addOffhandAttack),
    ...thrown.map(addThrownAttack),
    ...versatile.map(addTwoHandedAttack),
    ...lightThrown.map(addOffhandThrownAttack),
  ])
}
