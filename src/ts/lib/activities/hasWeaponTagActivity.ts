import { MadActivityKey } from '@/constants'

export const hasWeaponTagActivity = (weapon: Item, key: MadActivityKey) => weapon.system.activities.has(key)
