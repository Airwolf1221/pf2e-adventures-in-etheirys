import { MODULE_NAME, applyTranslations, prepareAmmunition, SpellNames, SpellTraditions } from "./constants.js";
import { blessingFeats, convertSpellDamage, hardcodedFeats } from "./feats.js";

// Setup FF Module Settings
function registerSettings() {
    game.settings.register(MODULE_NAME, "conversionTranslation", {
        name: "AIE.Settings.ConversionTranslation.Name",
        hint: "AIE.Settings.ConversionTranslation.Hint",
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: true
    });
    game.settings.register(MODULE_NAME, "CCOIntegration", {
        name: "AIE.Settings.CCOIntegration.Name",
        hint: "AIE.Settings.CCOIntegration.Hint",
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: true
    });
    game.settings.register(MODULE_NAME, "blessingFeats", {
        name: "AIE.Settings.BlessingFeats.Name",
        hint: "AIE.Settings.BlessingFeats.Hint",
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
    prepareAmmunition(CONFIG.PF2E.ammoTypes);
    CONFIG.PF2E.featCategories.blessing = "Mythic Blessing";
    CONFIG.PF2E.otherWeaponTags["samurai-weapon"] = "AIE.Identifiers.OtherTags.SamuraiWeapon";
    CONFIG.PF2E.classTraits.samurai = "AIE.Identifiers.Traits.Classes.Samurai.Name";
    CONFIG.PF2E.classTraits.paladin = "AIE.Identifiers.Traits.Classes.Paladin.Name";
    CONFIG.PF2E.classTraits.engineer = "AIE.Identifiers.Traits.Classes.Engineer.Name";
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
                            if (spaceLessName.toLowerCase().indexOf(spellIndex.toLowerCase()) === 12) {
                                let strippedName = spaceLessName.substring(spaceLessName.toLowerCase().indexOf(spellIndex.toLowerCase())), originalName = strippedName.indexOf("(");
                                if (originalName != -1) originalName = strippedName.substring(0,originalName);
                                else originalName = strippedName;
                                if (originalName.length != spellIndex.length) {
                                    break;
                                }

                                let baseName = spaceLessName.substring(0,spaceLessName.toLowerCase().indexOf(spellIndex.toLowerCase())).replaceAll('Effect:', ' Effect: ') + SpellNames[catIndex][spellIndex];
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
                if (!shouldLocalize) {
                    if (translation) return translation;
                    else return originalValue;
                } else return translatedName;
            },
            "localizeFF2eDescriptions": (originalValue,translation,data) => {
                if (data.type != 'spell' && data.type != "effect") {
                    if (translation) return translation;
                    else return originalValue;
                }
                let shouldLocalize = false,translatedDescription;

                for (const catIndex in SpellNames) {
                    for (const spellIndex in SpellNames[catIndex]) {
                        const indexName = spellIndex.replace(/([A-Z])/g, ' $1').trim();
                        let nameReg = new RegExp(`\\b${indexName}\\b`, "g");
                        if (data.name.match(nameReg) === null) continue;
                        let indexPosition = originalValue.toLowerCase().indexOf(indexName.toLowerCase());
                        let regex = new RegExp(indexName.toLowerCase(), "g"), indexCount = (originalValue.toLowerCase().match(regex ) || []).length;
                        if (indexPosition != -1 && indexCount > 0) {
                            if (indexCount === 1) {
                                translatedDescription = originalValue.substring(0,indexPosition) + SpellNames[catIndex][spellIndex] + originalValue.substring(indexPosition + indexName.length);
                                shouldLocalize = true;
                            } if (indexCount > 1) {
                                translatedDescription = originalValue;
                                for (let count = 0; count < indexCount; count++) {
                                    translatedDescription = translatedDescription.substring(0,indexPosition) + SpellNames[catIndex][spellIndex] + translatedDescription.substring(indexPosition + indexName.length);
                                    indexPosition = translatedDescription.toLowerCase().indexOf(indexName.toLowerCase());
                                }
                                shouldLocalize = true;
                            }
                        }
                    }
                }
                if (!shouldLocalize) {
                    if (translation) return translation;
                    else return originalValue;
                } else return translatedDescription;
            },
            "localizeFF2eSpellTraditions": (originalValue,translation,data) => {
                if (data.type != 'spell' && data.type != "effect") {
                    if (translation) return translation;
                    else return originalValue;
                }
                let shouldLocalize = false,translatedTraditions,spaceLessName = data.name.replaceAll(' ','');
                for (const catIndex in SpellTraditions) {
                    for (const spellIndex in SpellTraditions[catIndex]) {
                        if (spellIndex.toLowerCase() === spaceLessName.toLowerCase() && SpellTraditions[catIndex][spellIndex] != originalValue) {
                            shouldLocalize = true;
                            translatedTraditions = SpellTraditions[catIndex][spellIndex];
                        }
                    }
                }
                if (!shouldLocalize) {
                    if (translation) return translation;
                    else return originalValue;
                } else return translatedTraditions;
            }
        })
    }
});

// Perform Ready Checks
Hooks.on("ready", async () => {
    blessingFeats();

    // Translate default values when total conversion is turned on
    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation");
    if (conversionTranslation) {
        let defaultModuleTranslation = game.i18n.translations.AIE, defaultSystemTranslation = game.i18n.translations.PF2E;
        await applyTranslations(defaultModuleTranslation, defaultSystemTranslation);
    }

    // Create PF2e Dailies
    if (!game.modules.get("pf2e-dailies")?.active || !game.user.isGM) return;
    const register = game.modules.get("pf2e-dailies")?.api.registerCustomDailies;

    if (register) {
        const dailyHelpers = game.modules.get("pf2e-dailies")?.api.dailyHelpers;
        const astrologyUUID = "Compendium.pf2e-adventures-in-etheirys.feats.Item.je7qeZGJANF42zK2", expertAstrologyUUID = "Compendium.pf2e-adventures-in-etheirys.feats.Item.7mm3PjvBmuqPgUR5";
        const astrologyDaily = dailyHelpers.createComboSkillDaily("astrology", astrologyUUID, {rank: 1}), expertAstrologyDaily = dailyHelpers.createComboSkillDaily("expert-astrology", expertAstrologyUUID, {rank: 2});

        register([astrologyDaily,expertAstrologyDaily]);
    }
});

// Allow using one limit break to decrement the uses of all limit breaks & sync limit break uses
Hooks.on("preUpdateItem", async(item, updates) => {
    const actor = item.actor;
    if (!actor) return;
    const limitRanks = ["limit-break-1","limit-break-2","limit-break-3","limit-break-4"];
    if (item.system.traits.otherTags.some(t => limitRanks.includes(t))) {
        if (updates.flags?.pf2e?.forcedUpdate) {
            delete updates.flags.pf2e.forcedUpdate;
            return updates;
        }
        if (updates.system?.frequency?.value > item.system.frequency?.value) return;

        const lbUses = actor.system.resources.lbUses.value, newLbUses = lbUses -1;
        let newUses = undefined;
        if (!item.system.traits.otherTags.includes("limit-break-4")) {
            newUses = updates.system?.frequency?.value;
            if (lbUses != newUses) {
                await actor.updateResource("lbUses", newUses, { render: true});
            }
        } else await actor.updateResource("lbUses", newLbUses, { render: true});
        const otherLimitBreaks = actor.items.filter((i) => i.id != item.id && i.type === "feat" && i.system.traits.otherTags.some(t => limitRanks.includes(t)))
        if (otherLimitBreaks) {
            for (const otherLimitBreak in otherLimitBreaks) {
                if (!otherLimitBreaks[otherLimitBreak].system.traits.otherTags.includes("limit-break-4")) {
                    if (newUses) await otherLimitBreaks[otherLimitBreak].update({ "system.frequency.value": newUses, "flags.pf2e.forcedUpdate": true });
                    else await otherLimitBreaks[otherLimitBreak].update({ "system.frequency.value": newLbUses, "flags.pf2e.forcedUpdate": true });
                } else {
                    if (newUses = 0) await otherLimitBreaks[otherLimitBreak].update({ "system.frequency.value": 0, "flags.pf2e.forcedUpdate": true });
                }
            }
        }
    }
    if (item.slug === "blessing-of-the-limit") {
        let newLbUses = updates.system?.rules?.filter((i) => i.key === "SpecialResource");
        if (newLbUses?.length === 1) newLbUses = newLbUses[0].value;
        if (!newLbUses) return;
        const limitBreaks = item.actor.items.filter((i) => i.type === "feat" && i.system.traits.otherTags.some(t => limitRanks.includes(t)));
        for (const limitBreak in limitBreaks) {
            if (!limitBreaks[limitBreak].system.traits.otherTags.includes("limit-break-4")) {
                await limitBreaks[limitBreak].update({ "system.frequency.value": newLbUses, "flags.pf2e.forcedUpdate": true });
            } else {
                if (newLbUses === 0) await limitBreaks[limitBreak].update({ "system.frequency.value": 0, "flags.pf2e.forcedUpdate": true });
            }
        }
    }
});

Hooks.on("createItem", async(item) => {
    const itemType = item.type;
    if (itemType === "effect" && item.system.duration?.unit === "rounds" && item.system.duration?.value != 0) {
        const sourceItem = await fromUuid(item.system.context?.origin?.item);
        if (!sourceItem) return;
        const limitRanks = ["limit-break-1","limit-break-2","limit-break-3"];
        if ((sourceItem.type === "feat" && sourceItem.system.traits.otherTags.some(t => limitRanks.includes(t))) || sourceItem.slug === "beyond-mortal-limits") {
            const limitRank = getLimitBreakLevel(sourceItem.actor.level), duration = item.system.duration?.value;
            if (!duration) return;
            await item.update({ "system.duration.value": limitRank });
            return;
        }
    }
})

// Sync limit break max uses to the limit rank
Hooks.on("updateActor", async(actor, changes) => {
    const limitRanks = ["limit-break-1","limit-break-2","limit-break-3"];
    const limitBreaks = actor.items.filter((i) => i.type === "feat" && i.system.traits.otherTags.some(t => limitRanks.includes(t)));
    const actorLevel = changes?.system?.details?.level?.value || actor.level;
    const limitBreakCap = getLimitBreakLevel(actorLevel);
    for (const limitBreak in limitBreaks) {
        if (limitBreaks[limitBreak].system.frequency.max != limitBreakCap) {
            await limitBreaks[limitBreak].update({ "system.frequency.max": limitBreakCap, "system.frequency.value": actor.system.resources.lbUses.value, "flags.pf2e.forcedUpdate": true });
        }
    }
})

function getLimitBreakLevel(level) {
    if (level === 20) return 5
    else if (level >= 15) return 4;
    else if (level >= 10) return 3;
    else if (level >= 5) return 2;
    else return 1;
};

// Add Feat Filtering
Hooks.on("renderCharacterSheetPF2e", async(data, html) => {
    const blessingFeats = data.actor.feats.get("blessingFeats");
    if (!blessingFeats) return;
    if (!blessingFeats.filter.traits) {
        data.actor.feats.get("blessingFeats").filter.traits = [];
        data.actor.feats.get("blessingFeats").filter.traits.push("blessing");
    } else {
        if (data.actor.feats.get("blessingFeats").filter.traits.indexOf("blessing") === -1) {
            data.actor.feats.get("blessingFeats").filter.traits.push("blessing");
        }
    }
});

// Second Part of Mythic Reroll
Hooks.on("pf2e.reroll", async(oldRoll, newRoll, resource, keep) => {
    const blessingFeats = game.settings.get(MODULE_NAME, "blessingFeats");
    if (blessingFeats) {
        const actor = game.actors.get(game.user.getFlag("pf2e-adventures-in-etheirys", "mythicCheck.actorId"));
        const checkModifiers = game.user.getFlag("pf2e-adventures-in-etheirys", "mythicCheck.totalCheckModifier");
        const profMod = game.user.getFlag("pf2e-adventures-in-etheirys", "mythicCheck.proficiencyMod");
        if (!actor || checkModifiers === undefined || profMod === undefined || !resource) return;
        if (checkModifiers != oldRoll.options.totalModifier) return;

        const die = newRoll.dice.find((d) => d instanceof foundry.dice.terms.Die && d.number === 1 && d.faces === 20);
        if (die) {
            const numericAdditions = newRoll.terms.find((t) => t.number === checkModifiers);
            const mythicMod = 10 + actor.level;
            if (numericAdditions) newRoll.terms.find((t) => t.number === checkModifiers).number = numericAdditions.number - profMod + mythicMod;
            else {
                newRoll.terms.push(
                    foundry.dice.terms.OperatorTerm.fromData({ class: "OperatorTerm", operator: "+", evaluated: true}),
                    foundry.dice.terms.NumericTerm.fromData({ class: "NumericTerm", number: mythicMod, evaluated: true}),
                );
            }
            newRoll._total = newRoll._total - profMod + mythicMod;
            newRoll.options.mythicProf = true;
        }
    }
});

// Third Part of Mythic Reroll
Hooks.on("renderChatMessage", async (message, jq) => {
    const lastRoll = message.rolls.at(-1);
    if (!lastRoll) return;
    const element = jq.get(0);
    if (!element) return;

    if (lastRoll.options.mythicProf) {
        const tags = element.querySelector(".flavor-text > .tags.modifiers");
        const formulaElem = element.querySelector(".reroll-discard .dice-formula");
        const newTotalElem = element.querySelector(".reroll-second .dice-total");

        if (tags && formulaElem && newTotalElem) {
            const actor = game.actors.get(game.user.getFlag("pf2e-adventures-in-etheirys", "mythicCheck.actorId"));
            const profMod = game.user.getFlag("pf2e-adventures-in-etheirys", "mythicCheck.proficiencyMod");
            if (!actor || profMod === undefined) return;

            const mythicMod = 10 + actor.level;
            const profTag = tags.querySelector("[data-slug=proficiency]");
            profTag.innerText = `Mythic +${mythicMod}`
            profTag.classList.add("mythic-reroll");
            formulaElem.innerText = lastRoll.formula;
            newTotalElem.classList.add("mythic-reroll");
        }
        await game.user.unsetFlag("pf2e-adventures-in-etheirys", "mythicCheck");
    }
})

// First part of Mythic Rerolling
Hooks.on("closeCheckModifiersDialog", async (checkData, html) => {
    const actor = checkData.context.actor;
    if (!actor) return;
    const blessingFeats = game.settings.get(MODULE_NAME, "blessingFeats");
    if (blessingFeats) {
        const checkProficiency = checkData.check.modifiers.filter(mod => mod.slug === "proficiency" && mod.enabled === true);
        if (checkProficiency.length != 1) return;

        const checkModifiers = checkData.check.totalModifier, proficiencyMod = checkProficiency[0].modifier || 0;
        await game.user.unsetFlag("pf2e-adventures-in-etheirys", "mythicCheck");
        await game.user.setFlag("pf2e-adventures-in-etheirys", "mythicCheck.totalCheckModifier", checkModifiers);
        await game.user.setFlag("pf2e-adventures-in-etheirys", "mythicCheck.proficiencyMod", proficiencyMod);
        await game.user.setFlag("pf2e-adventures-in-etheirys", "mythicCheck.actorId", actor.id);
    }
});

// Hardcode in notable feat rules, such as adding appropriate ff ancestry traits to vanilla ancestry feats
// NOT CURRENTLY IN USE
/*Hooks.on("createItem", async (item) => {
    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation");
    if (conversionTranslation) convertSpellDamage(item);
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