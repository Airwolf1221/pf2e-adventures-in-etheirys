/** 
 * A constant handle for the module name if I ever end up changing it. 
 *
 * **WARNING!** If this changes, you HAVE to change the macros too.
 */
export const MODULE_NAME = "pf2e-adventures-in-etheirys";

/* Import the Total Conversion JSON file, and export the spell names for config options */
const ConversionTranslationObject = await foundry.utils.fetchJsonWithTimeout(`modules/${MODULE_NAME}/lang/activeTranslation/ff2e-totalconversion.json`);
export const SpellNames = ConversionTranslationObject.AIE.SpellNames;
export const SpellTraditions = ConversionTranslationObject.AIE.SpellTraditions;

export async function prepareAmmunition(ammoObj) {
    ammoObj["rounds-aetheric-gunblade"] = {
        "label": "Rounds (Aetheric Gunblade)",
        "magazine": false,
        "parent": "rounds",
        "stackGroup": "rounds10",
        "weapon": "aetheric-gunblade"
    }
    ammoObj["shells-grafted-arm-cannon"] = {
        "label": "Shells (Grafted Arm Cannon)",
        "magazine": false,
        "parent": "rounds",
        "stackGroup": "rounds5",
        "weapon": "grafted-arm-cannon"
    }
    ammoObj["gatling grafted-arm-magazine"] = {
        "label": "Gatling Grafted Arm Magazine",
        "magazine": 8,
        "parent": "magazine",
        "stackGroup": null,
        "weapon": "gatling-grafted-arm"
    }
    ammoObj["assault-gunblade-cartridge"] = {
        "label": "Assault Gunblade Cartridge",
        "magazine": 5,
        "parent": "magazine",
        "stackGroup": null,
        "weapon": "assault-gunblade"
    }
    return ammoObj;
}

export async function applyTranslations(ModuleTranslation, SystemTranslation) {
    let newModuleTranslation = ConversionTranslationObject.AIE, overrideSystemTranslation = ConversionTranslationObject.PF2E;
    ModuleTranslation.SpellNames = newModuleTranslation.SpellNames;
    SystemTranslation = deepMerge(SystemTranslation,overrideSystemTranslation);
    game.i18n.translations.PF2E = SystemTranslation;
}

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