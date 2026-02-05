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
    if (itemType === null || itemType != 'spell') return;

    const spellTraits = spell.system.traits.value;
    let elementTrait, elementCount = 1;

    for (const trait of spellTraits.keys()) {
        if (elementalTraits.includes(spellTraits[trait])) {
            if (elementTrait) elementCount++;
            elementTrait = spellTraits[trait];
        }
    }

    if (!elementTrait) return replaceDamageType(spell, 'wind-ff', 'sonic');
    if (["wind","earth","water"].includes(elementTrait)) elementTrait = elementTrait + '-ff';
    if (elementCount > 1) {
        if (spellTraits.includes("air")) elementCount--;
        if (elementCount > 1) return console.log(`Spell has multiple elemental traits! It has ${elementCount} in total. Skipping this spell!`);
    }

    replaceDamageType(spell, elementTrait);
}

async function replaceDamageType(spell, newDamageType, filter = null) {
    const existingSpellDamage = spell.system.damage, existingSpellHeightening = spell.system.heightening?.levels ?? null;
    let newSpellDamage = [], newSpellHeightening = [];

    // Parse basic damage
    for (const damage in existingSpellDamage) {
        const damageType = existingSpellDamage[damage].type;
        if (!filter || damageType === filter) {
            if (damageType === newDamageType) continue;
            else {
                let updatedDamage = existingSpellDamage[damage];
                updatedDamage.type = newDamageType;
                newSpellDamage = Object.assign(newSpellDamage, [updatedDamage]);
            }
        } else continue;
    }

    if (newSpellDamage.length === 0) return;
    spell.update({ 'system.damage': newSpellDamage});

    if (!existingSpellHeightening) return;

    // Parse specific heightened damage
    for (const rank in existingSpellHeightening) {
        for (const rankDamage in existingSpellHeightening[rank].damage) {
            const damageType = existingSpellHeightening[rank].damage[rankDamage].type;
            if (!filter || damageType === filter) {
                if (damageType === newDamageType) continue;
                else {
                    let updatedDamage = existingSpellHeightening;
                    updatedDamage[rank].damage[rankDamage].type = newDamageType;
                    newSpellHeightening = Object.assign(newSpellHeightening, updatedDamage);
                }
            } else continue;
        }
    }
    newSpellHeightening = Object.fromEntries(Object.entries(newSpellHeightening).filter(([_, v]) => v != null));

    if (newSpellHeightening.length === 0) return;
    else return spell.update({ 'system.heightening.levels': newSpellHeightening});
}