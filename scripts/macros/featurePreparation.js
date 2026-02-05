export function registerFeatures() {
    const config = CONFIG.PF2E
    let ammoTypes = config.ammoTypes, weaponTags = config.otherWeaponTags, classTraits = config.classTraits, featCategories = config.featCategories;
    const newAmmoTypes = {
        "assault-gunblade-cartridge": {
            "label": "Assault Gunblade Cartridge",
            "magazine": 5,
            "parent": "magazine",
            "stackGroup": null,
            "weapon": "assault-gunblade"
        },
        "gatling-grafted-arm-magazine": {
            "label": "Gatling Grafted Arm Magazine",
            "magazine": 8,
            "parent": "magazine",
            "stackGroup": null,
            "weapon": "gatling-grafted-arm"
        },
        "rounds-aetheric-gunblade": {
            "label": "Rounds (Aetheric Gunblade)",
            "magazine": false,
            "parent": "rounds",
            "stackGroup": "rounds10",
            "weapon": "aetheric-gunblade"
        },
        "shells-grafted-arm-cannon": {
            "label": "Shells (Grafted Arm Cannon)",
            "magazine": false,
            "parent": "rounds",
            "stackGroup": "rounds5",
            "weapon": "grafted-arm-cannon"
        },
    }, newClassTraits = {
        engineer: "AIE.Identifiers.Traits.Classes.Engineer.Name",
        paladin: "AIE.Identifiers.Traits.Classes.Paladin.Name",
        samurai: "AIE.Identifiers.Traits.Classes.Samurai.Name"
    }, newWeaponTags = {
        "samurai-weapon": "AIE.Identifiers.OtherTags.SamuraiWeapon"
    }, newFeatCategories = {
        blessing: "AIE.Identifiers.MythicBlessing"
    }

    ammoTypes = Object.assign(ammoTypes, newAmmoTypes);
    classTraits = Object.assign(classTraits, newClassTraits);
    featCategories = Object.assign(featCategories, newFeatCategories);
    weaponTags = Object.assign(weaponTags, newWeaponTags);
}