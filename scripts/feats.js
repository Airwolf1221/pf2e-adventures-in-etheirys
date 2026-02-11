const featTraits = {
    // Engineer Class Features/Feats
    'Medium Armor Mastery': ['engineer'],
    'Tamper': ['engineer'],
    'Visual Fidelity': ['engineer'],
    'Gigavolt': ['engineer'],
    'You Failed to Account For... This!': ['engineer'],
    // Paladn Class Features/Feats
    'Shield Block': ['paladin'],
    'Agile Shield Grip': ['paladin'],
    'Reactive Shield': ['paladin'],
    'Devoted Guardian': ['paladin'],
    'Reliable Squire': ['paladin'],
    'Knock Sense': ['paladin'],
    'Reflexive Shield': ['paladin'],
    'Shield Warden': ['paladin'],
    'Impassable Wall Stance': ['paladin'],
    'Quick Shield Block': ['paladin'],
    'Shield of Grace': ['paladin'],
    'Perfect Protection': ['paladin'],
    // Samurai Class Features/Feats
    'Bravery': ['samurai'],
    'Armor Expertise': ['samurai'],
    'Evasion': ['samurai'],
    'Armor Mastery': ['samurai'],
    'Juggernaut': ['samurai'],
    'Lunge': ['dragoon', 'samurai'],
    'Quick Reversal': ['samurai'],
    'Two-Weapon Flurry': ['samurai'],
    'Impossible Flurry': ['samurai'],
    // Shared Class Features/Feats
    'Determination': ['paladin','samurai'],
    'Weapon Specialization': ['engineer','paladin','samurai'],
    'Greater Weapon Specialization': ['engineer','paladin','samurai'],
    'Intimidating Strike': ['dragoon','samurai','warrior'],
    'Whirlwind Strike': ['dragoon','reaper','samurai','warrior'],
    'Reflex Expertise': ['engineer','paladin'],
    'Reactive Strike': ['paladin'],
    'Savage Critical': ['dragoon','samurai']
};

function assignClassTraits(original, translation, data) {
    if (!featTraits[data.name] || (data.name === "Shield Block" && data.system.category === "general")) {
        if (translation) return translation;
        else return original;
    }

    const finalArray = original.concat(featTraits[data.name]);
    return finalArray;
}

/*const hardcodedFeats = {
    "Compendium.pf2e.equipment-srd.Item.Xnqglykl3Cif8rN9": { // Lesser Blasting Stone (FF conversion)
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
    }
};*/

// Hardcode in notable feat rules for existing items
/*Hooks.on("createItem", async (item) => {
    const sourceId = item.sourceId ?? "";

    if (sourceId in hardcodedFeats) {
        if (hardcodedFeats[sourceId].check(item)) {
            if(hardcodedFeats[sourceId.newREs]) {
            const keepOldREs = hardcodedFeats[sourceId].deleteOldREs ? [] : item.system.rules;
            await item.update({ "system.rules": keepOldREs.concat(hardcodedFeats[sourceId].newREs)});
            }
            if(hardcodedFeats[sourceId.newTraits]) {
                const replaceTraits = hardcodedFeats[sourceId].deleteOldTraits? [] : item.system.traits.value;
                await item.update({ "system.traits.value": replaceTraits.concat(hardcodedFeats[sourceId].newTraits)});
            }
        }
    }
});*/

export let featHandler = {
    'assignClassTraits': assignClassTraits
}