import { getAllOwnedWeapons } from '@/lib/foundry'
import { addOffhandAttack, hasOffhandAttack } from './addOffhandAttack'
import { addThrownAttack, hasThrownAttack } from './addThrowAttack'
import { addTwoHandedAttack, hasTwoHandedAttack } from './addTwoHandedAttack'
import { addOffhandThrownAttack, hasOffhandThrownAttack } from './addOffhandThrownAttack'
import { Dnd5eItemProperty } from '@/models'
import { debug } from '../util/debug'

export const addWeaponTagActivities = async (weapons?: Item[]) => {
  weapons ??= getAllOwnedWeapons()

  const light = weapons.filter(
    (weapon) => weapon.system.properties.has(Dnd5eItemProperty.Light) && !hasOffhandAttack(weapon),
  )
  debug(
    'Found light weapons without offhand attack:',
    light.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const thrown = weapons.filter(
    (weapon) => weapon.system.properties.has(Dnd5eItemProperty.Thrown) && !hasThrownAttack(weapon),
  )
  debug(
    'Found thrown weapons without throw attack:',
    thrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const lightThrown = light.filter((weapon) => thrown.includes(weapon) && !hasOffhandThrownAttack(weapon))
  debug(
    'Found light, thrown weapons without offhand throw attack:',
    lightThrown.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  const versatile = weapons.filter(
    (weapon) => weapon.system.properties.has(Dnd5eItemProperty.Versatile) && !hasTwoHandedAttack(weapon),
  )
  debug(
    'Found versatile weapons without two-handed attack:',
    versatile.map((weapon) => ({ id: weapon.id, name: weapon.name })),
  )

  await Promise.all([
    ...light.map(addOffhandAttack),
    ...thrown.map(addThrownAttack),
    ...versatile.map(addTwoHandedAttack),
    ...lightThrown.map(addOffhandThrownAttack),
  ])
}
