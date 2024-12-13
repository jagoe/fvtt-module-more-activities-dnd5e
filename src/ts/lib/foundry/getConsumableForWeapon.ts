export const getConsumableForWeapon = (weapon: Item) =>
  (weapon.parent as Actor)?.items?.find((item) => item.type === 'consumable' && item.name === weapon.name) ?? null
