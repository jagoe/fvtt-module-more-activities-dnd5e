# Foundry VTT Module: More Activities for dnd5e

This module adds more activities to items with certain tags, allowing an integration between modules like the amazing
[Ready Set Roll for dnd5e](https://github.com/MangoFVTT/fvtt-ready-set-roll-5e) and the system's special item actions,
such as off-hand attacks for light weapons, two-handing versatile weapons, or throwing thrown weapons.

## Requirements

* `dnd5e` (version 4+): This module depends on item activities, which are exclusive to the `dnd5e` system.

## How it works

To make it work, you just need to activate the module. It will automatically go through all weapons with the relevant tags (light, thrown, versatile) and create custom activities for them:

* `Light` weapons will get an `Offhand` attack activity that ignores the ability modifier when rolling for damage. For characters with the Two-Weapon Fighting fighting style, you can still use the normal attack activity.
* `Thrown` weapons will get a `Throw` attack activity that uses the weapon's throwing range. This doesn't change anything by itself, but this way other modules may use the correct attack range. The default action will now use the weapon's reach instead of defaulting to the throwing range. Additionally, a consumable with the weapon's name will be created (if it doesn't already exist), which will be consumed with each `Throw`.
* `Versatile` weapons will get a `Two-Handed` attach activity that uses the weapon's versatile damage stats. To help distinguishing between activities, the default attack action gets renamed to `One-Handed`.
* Weapons that have both the `light` and `thrown` tags will get an additional `Offhand Throw` attack activity that combines the changes for this attack.

In case you play around with the custom activities and want to reset them the the module default, you can use the `Remove` and `Create` buttons in the module configuration.
