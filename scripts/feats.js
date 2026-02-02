import { MODULE_NAME } from "./constants.js";

export const hardcodedFeats = {
    /*"Compendium.pf2e.equipment-srd.Item.Xnqglykl3Cif8rN9": { // Lesser Blasting Stone (FF conversion)
        check: (item) => {
            return true;
        },
        translationRequired: true,
        deleteOldTraits: true,
        newTraits: ["alchemical","bomb","consumable","splash","wind"]
    },
    "Compendium.pf2e.equipment-srd.Item.JOaELkzLWTywhn5Z": { // Moderate Blasting Stone (FF conversion)
        check: (item) => {
            return true;
        },
        translationRequired: true,
        deleteOldTraits: true,
        newTraits: ["alchemical","bomb","consumable","splash","wind"]
    },
    "Compendium.pf2e.equipment-srd.Item.dsMkvuLgpOOGLWDy": { // Greater Blasting Stone (FF conversion)
        check: (item) => {
            return true;
        },
        translationRequired: true,
        deleteOldTraits: true,
        newTraits: ["alchemical","bomb","consumable","splash","wind"]
    },
    "Compendium.pf2e.equipment-srd.Item.IuGydh0En8LbfnWo": { // Major Blasting Stone (FF conversion)
        check: (item) => {
            return true;
        },
        translationRequired: true,
        deleteOldTraits: true,
        newTraits: ["alchemical","bomb","consumable","splash","wind"]
    }*/
}

const elementalTraits = [
    "air",
    "cold",
    "earth",
    "electricity",
    "fire",
    "water"
]

export async function convertSpellDamage(spell) {
    const itemType = spell.type ?? null;
    if (itemType === null || itemType != "spell") return;
    const spellTraits = spell.system.traits.value;
    let elementKey, elementCount = 1;
    for (const key of spellTraits.keys()) {
        if(elementalTraits.includes(spellTraits[key])) {
            if (elementKey) elementCount++;
            elementKey = spellTraits[key];
        }
    }
    if (!elementKey) {
        await replaceDamageType(spell, "wind-ff", "sonic");
        return;
    }
    if (elementKey === "wind" || elementKey === "earth" || elementKey === "water") {
        elementKey = elementKey + "-ff";
    }
    if (elementCount > 1) {
        if (spellTraits.includes("air")) elementCount--;
        if (elementCount > 1) {
            console.log(`Spell has more than one elemental trait! It has ${elementCount} in total. Skipping the spell!`);
            return;
        }
    }
    let damageTypesReplaced = await replaceDamageType(spell, elementKey);
}

async function replaceDamageType(spell, newDamageType, filterDamageType = null) {
    let existingSpellDmg = spell.system.damage, damageTypesReplaced = 0;
    // Parse Basic Damage
    for (const spellDamage in existingSpellDmg) {
        const damageType = existingSpellDmg[spellDamage].type;
        if (!filterDamageType || damageType === filterDamageType) {
            if (damageType === newDamageType) {
                continue;
            } else {
                existingSpellDmg[spellDamage].type = newDamageType;
                damageTypesReplaced++;
            }
        } else {
            continue;
        }
    }
    // Parse Heightening
    let existingSpellHeightened = spell.system.heightening?.levels ?? null;
    if (!existingSpellHeightened) return damageTypesReplaced;
    for (const heightenedRank in existingSpellHeightened) {
        for (const rankDamage in existingSpellHeightened[heightenedRank].damage) {
            const damageType = existingSpellHeightened[heightenedRank].damage[rankDamage].type;
            if (!filterDamageType || damageType === filterDamageType) {
                if (damageType === newDamageType) {
                    continue;
                } else {
                    existingSpellHeightened[heightenedRank].damage[rankDamage].type = newDamageType;
                    damageTypesReplaced++;
                }
            } else {
                continue;
            }
        }
    }
    return damageTypesReplaced;
}

export async function blessingFeats() {
    const blessingFeats = game.settings.get(MODULE_NAME, "blessingFeats");
    if (blessingFeats) {
        const campaignFeatSections = game.settings.get("pf2e", "campaignFeatSections",);
        if (!campaignFeatSections.find((section) => section.id === "blessingFeats")) {
            campaignFeatSections.push({
                id: "blessingFeats",
                label: "Blessing of Light Feats",
                supported: ["blessing"],
                slots: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
            })
        }
        await game.settings.set("pf2e", "campaignFeatSections", campaignFeatSections);
    }
    const campaignFeatSections = game.settings.get("pf2e", "campaignFeatSections",);

    if (campaignFeatSections && !blessingFeats && campaignFeatSections.find((section) => section.id === "blessingFeats")) {
        campaignFeatSections.splice(campaignFeatSections.findIndex((section) => section.id === "blessingFeats"));
        await game.settings.set("pf2e", "campaignFeatSections", campaignFeatSections);
    }
}