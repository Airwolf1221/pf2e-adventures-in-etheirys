import { MODULE_NAME, ApplyTranslations, SpellNames } from "./constants.js";
import { hardcodedFeats } from "./feats.js";

// Setup FF Module Settings
function registerSettings() {
    game.settings.register(MODULE_NAME, "conversionTranslation", {
        name: "AIE.Settings.ConverstionTranslation.Name",
        hint: "AIE.Settings.ConverstionTranslation.Hint",
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: true
    });
}

// Initialise the Module
Hooks.once("init", async () => {
    registerSettings();
    console.log("[Final Fantasy - Adventures in Etheirys]: INITIALISATION READY!");

    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation");
    if(game.babele !== "undefined" && conversionTranslation === true) {
        game.babele.register({
            module: MODULE_NAME,
            lang: 'en',
            dir: 'translations'
        });

        game.babele.registerConverters({
            "localizeFF2eNames": (originalValue,translation,data) => {
                if (data.type != 'spell' && data.type != "effect") {
                    if (translation) return translation;
                    else return originalValue;
                }
                let spaceLessName = originalValue.replaceAll(' ',''),translatedName;
                let shouldLocalize = false;

                for (const catIndex in SpellNames) {
                    for (const spellIndex in SpellNames[catIndex]) {
                        if (data.type === 'spell') {
                            if (spellIndex.toLowerCase() === spaceLessName.toLowerCase() && SpellNames[catIndex][spellIndex] != originalValue) {
                                shouldLocalize = true;
                                translatedName = SpellNames[catIndex][spellIndex];
                            }
                        } else if (data.type === 'effect') {
                            if (spaceLessName.indexOf(spellIndex) === 12) {
                                let strippedName = spaceLessName.substring(spaceLessName.indexOf(spellIndex)), originalName = strippedName.indexOf("(");
                                if (originalName != -1) originalName = strippedName.substring(0,originalName);
                                else originalName = strippedName;
                                if (originalName.length != spellIndex.length) {
                                    break;
                                }

                                let baseName = spaceLessName.substring(0,spaceLessName.indexOf(spellIndex)).replaceAll('Effect:', ' Effect: ') + SpellNames[catIndex][spellIndex];
                                let affix = originalValue.indexOf("(");
                                if (affix != -1) {
                                    affix = originalValue.substring(affix-1);
                                    translatedName = baseName + affix;
                                } else translatedName = baseName;
                                shouldLocalize = true;
                            }
                        }
                    }
                }
                if (!shouldLocalize) return originalValue;
                else return translatedName;
            },
            "localizeFF2eDescriptions": (originalValue,translation,data) => {
                let shouldLocalize = false,translatedDescription;
                for (const catIndex in SpellNames) {
                    for (const spellIndex in SpellNames[catIndex]) {
                        const indexName = spellIndex.replace(/([A-Z])/g, ' $1').trim()
                        let indexPosition = originalValue.indexOf(indexName);
                        let regex = new RegExp(indexName, "g"), indexCount = (originalValue.match(regex ) || []).length;
                        if (indexPosition != -1 && indexCount > 0) {
                            if (indexCount === 1) {
                                translatedDescription = originalValue.substring(0,indexPosition) + SpellNames[catIndex][spellIndex] + originalValue.substring(indexPosition + indexName.length);
                                shouldLocalize = true;
                            } if (indexCount > 1) {
                                translatedDescription = originalValue;
                                for (let count = 0; count < indexCount; count++) {
                                    translatedDescription = translatedDescription.substring(0,indexPosition) + SpellNames[catIndex][spellIndex] + translatedDescription.substring(indexPosition + indexName.length);
                                    indexPosition = translatedDescription.indexOf(indexName);
                                }
                                shouldLocalize = true;
                            }
                        }
                    }
                }
                if (!shouldLocalize) return originalValue;
                else return translatedDescription;
            }
        })
    }
});

// Perform Ready Checks
Hooks.on("ready", async () => {
    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation");

    if (conversionTranslation) {
        let defaultModuleTranslation = game.i18n.translations.AIE, defaultSystemTranslation = game.i18n.translations.PF2E;
        await ApplyTranslations(defaultModuleTranslation, defaultSystemTranslation);
    }
})

// Hardcode in notable feat rules, such as adding appropriate ff ancestry traits to vanilla ancestry feats
Hooks.on("createItem", async (item) => {
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
});