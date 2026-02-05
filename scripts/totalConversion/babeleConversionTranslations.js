import { featHandler } from "../feats.js";
import { MODULE_NAME } from "../settings.js"

/* Import the Total Conversion JSON file, and define the spell names for translation options */
const conversionTranslationObject = await foundry.utils.fetchJsonWithTimeout(`modules/${MODULE_NAME}/lang/activeTranslation/ff2e-totalconversion.json`);
const spellNames = conversionTranslationObject.AIE.SpellNames;
const spellTraditions = conversionTranslationObject.AIE.SpellTraditions;

export let tcBabele = {
    'babeleInit': async function _babeleInit() {
        if (game.babele !== "undefined") {
            game.babele.register({
                module: MODULE_NAME,
                lang: 'en',
                dir: 'translations/totalConversion'
            });

            registerBabeleConverters();
        }
    },
    'translateSystemFields': async function _translateSystemFields(moduleTranslation, systemTranslation) {
        moduleTranslation.SpellNames = conversionTranslationObject.AIE.SpellNames;
        systemTranslation = deepMerge(systemTranslation, conversionTranslationObject.PF2E);
        game.i18n.translations.PF2E = systemTranslation;
    }
}

async function registerBabeleConverters() {
    game.babele.registerConverters({
        'localizeTotalConversionNames': (original, translation, data) => {
            if (data.type != 'spell' && data.type != 'effect') {
                if (translation) return translation;
                else return original;
            }

            const camelCaseName = original.replaceAll(' ','');
            let translatedName, shouldLocalize = false;

            for (const category in spellNames) {
                for (const spell in spellNames[category]) {
                    switch (data.type) {
                        case 'spell':
                            if (spell.toLowerCase() === camelCaseName.toLowerCase() && spellNames[category][spell] != original) {
                                shouldLocalize = true;
                                translatedName = spellNames[category][spell];
                            }
                        case 'effect':
                            if (camelCaseName.toLowerCase().indexOf(spell.toLowerCase()) === 12) {
                                const strippedName = camelCaseName.substring(camelCaseName.toLowerCase().indexOf(spell.toLowerCase()));
                                let originalName = strippedName.indexOf("(");

                                if (originalName != -1) originalName = strippedName.substring(0, originalName);
                                else originalName = strippedName;

                                if (originalName.length != spell.length) break;

                                const baseName = camelCaseName.substring(0, camelCaseName.toLowerCase().indexOf(spell.toLowerCase())).replaceAll('Effect:', ' Effect: ') + spellNames[category][spell];
                                let affix = original.indexOf("(");

                                if (affix != -1) {
                                    affix = original.substring(affix - 1);
                                    translatedName = baseName + affix;
                                } else translatedName = baseName;
                                shouldLocalize = true;
                            }
                    }
                }
            }

            return returnLocalization(shouldLocalize, original, translation, translatedName);
        },
        'localizeTotalConversionDescriptions': (original, translation, data) => {
            if (data.type != 'spell' && data.type != 'effect') {
                if (translation) return translation;
                else return original;
            }

            let translatedDescription, shouldLocalize = false;

            for (const category in spellNames) {
                for (const spell in spellNames[category]) {
                    const indexName = spell.replace(/([A-Z])/g, ' $1').trim();
                    const nameRegEx = new RegExp(`\\b${indexName.toLowerCase()}\\b`, 'g');
                    if (data.name.toLowerCase().match(nameRegEx) == null) continue;

                    let indexPos = original.toLowerCase().indexOf(indexName.toLowerCase());
                    const indexRegex = new RegExp(indexName.toLowerCase(), 'g'), indexCount = (original.toLowerCase().match(indexRegex) || []).length;

                    if (indexPos != -1 && indexCount > 0) {
                        if (indexCount === 1) {
                            translatedDescription = original.substring(0, indexPos) + spellNames[category][spell] + original.substring(indexPos + indexName.length);
                            shouldLocalize = true;
                        }
                        if (indexCount > 1) {
                            translatedDescription = original;
                            for (let count = 0; count < indexCount; count++) {
                                translatedDescription = translatedDescription.substring(0, indexPos) + spellNames[category][spell] + translatedDescription.substring(indexPos + indexName.length);
                                indexPos = translatedDescription.toLowerCase().indexOf(indexName.toLowerCase());
                            }
                            shouldLocalize = true;
                        }
                    }
                }
            }

            return returnLocalization(shouldLocalize, original, translation, translatedDescription);
        },
        'localizeTotalConversionSpellTraditions': (original, translation, data) => {
            if (data.type != 'spell' && data.type != 'effect') {
                if (translation) return translation;
                else return original;
            }

            const camelCaseName = data.name.replaceAll(' ', '');
            let translatedTraditions, shouldLocalize = false;

            for (const category in spellTraditions) {
                for (const spell in spellTraditions[category]) {
                    if (spell.toLowerCase() === camelCaseName.toLowerCase() && spellTraditions[category][spell] != original) {
                        translatedTraditions = spellTraditions[category][spell];
                        shouldLocalize = true;
                    }
                }
            }

            return returnLocalization(shouldLocalize, original, translation, translatedTraditions);
        },
        'appendClassTraits': (original, translation, data) => {
            return featHandler.assignClassTraits(original, translation, data);
        }
    });
}

function returnLocalization(shouldLocalize, original, translation, translatedField) {
    switch (shouldLocalize) {
        case true:
            return translatedField;
        case false:
            if (translation) return translation;
            else return original;
    }
}

// Deep Merge two types of Object, retaining all values in both
function deepMerge(...objs) {
    function getType(obj) {
        return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
    }

    function mergeObject(cloneArray, obj) {
        for (let [key, value] of Object.entries(obj)) {
            let type = getType(value);
            if (cloneArray[key] !== undefined && getType(cloneArray[key]) === type && ['array', 'object'].includes(type)) {
                cloneArray[key] = deepMerge(cloneArray[key], value);
            } else {
                cloneArray[key] = structuredClone(value);
            }
        }
    }

    let cloneArray = structuredClone(objs.shift());

    for (let obj of objs) {
        let type = getType(obj);
        if (getType(cloneArray) !== type) {
            cloneArray = structuredClone(obj);
            continue;
        }

        if (type === 'array') {
            cloneArray = [...cloneArray, ...structuredClone(obj)];
        } else if (type === 'object') {
            mergeObject(cloneArray, obj);
        } else {
            cloneArray = obj;
        }
    }
    return cloneArray;
}