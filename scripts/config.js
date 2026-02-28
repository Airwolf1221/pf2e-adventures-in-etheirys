import { registerFeatures } from "./macros/featurePreparation.js";
import { mythic } from "./mythic/mythic.js";
import { totalConversion } from "./totalConversion/totalConversion.js";
import { configureDailies } from "./newDailies.js";
import { MODULE_NAME, registerSettings } from "./settings.js";
import { featHandler } from "./feats.js";
import { macros } from "./macros/macros.js";
import { vitalityVoidImmunity } from "./macros/vitalityVoidDamageSubstitution.js";

// Initialise the Module
Hooks.once("init", async () => {
    registerSettings();
    registerFeatures();
    console.log("[Final Fantasy - Adventures in Etheirys]: INITIALISATION READY!");

    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation");
    if (conversionTranslation) totalConversion.babeleTC.babeleInit();
    
    if (game.babele !== 'undefined') {
        game.babele.register({
            module: MODULE_NAME,
            lang: 'en',
            dir: 'translations/classFeatures'
        });

        game.babele.registerConverters({
            'appendClassTraits': (original, translation, data) => {
                return featHandler.assignClassTraits(original, translation, data);
            }
        });
    }

    console.log("[Final Fantasy - Adventures in Etheirys]: BABELE READY!");

    libWrapper.register(
        MODULE_NAME,
        'CONFIG.Actor.documentClass.prototype.isAffectedBy',
        vitalityVoidImmunity,
        'OVERRIDE'
    )
});

// Register Module Triggers
Hooks.once("triggerEngine.registerTriggers", (registerTriggers) => {
    registerTriggers("trigger-engine", "pf2e-trigger", "modules/pf2e-adventures-in-etheirys/ff2e-triggers/triggers.json");
});

// Perform Ready Checks
Hooks.once("ready", async () => {
    const conversionTranslation = game.settings.get(MODULE_NAME,"conversionTranslation"), mythicSetting = game.settings.get(MODULE_NAME, 'mythic');
    mythic.blessingFeats.featHandling();

    // Engineer Handling
    Hooks.on('createItem', macros.engineer.multiTool.createTool);
    // Samurai Handling
    Hooks.on('createChatMessage', macros.samurai.combos.incrementCombo);

    // Assign various hooks
    if (conversionTranslation) { // If the total conversion is enabled, enable the myriad of specific hooks for that.
        console.log("[Final Fantasy - Adventures in Etheirys]: CONFIGURING TOTAL CONVERSION!");
        Hooks.on('createItem', totalConversion.spellConversion);
        totalConversion.babeleTC.translateSystemFields(game.i18n.translations.AIE, game.i18n.translations.PF2E);
    }

    if (mythicSetting) {
        console.log("[Final Fantasy - Adventures in Etheirys]: CONFIGURING MYTHIC AUTOMATION!");
        // Add Mythic Feat Slot Filtering
        Hooks.on('renderCharacterSheetPF2e', mythic.blessingFeats.featFiltering);
        // Implement Mythic Rerolling
        Hooks.on('closeCheckModifiersDialog', mythic.reroll.assignDomain);
        Hooks.on('renderChatMessageHTML', mythic.reroll.chatMessage);
        // Implement Limit Break Automation
        Hooks.on('preUpdateItem', mythic.limitBreak.decrementUses);
        Hooks.on('createItem', mythic.limitBreak.syncEffects);
        Hooks.on('updateActor', mythic.limitBreak.updateActor);
        Hooks.on('pf2e.restForTheNight', mythic.limitBreak.restLB4Reset);
    }

    // Create PF2e Dailies
    if (game.modules.get("pf2e-dailies")?.active && game.user.isGM) {
        console.log("[Final Fantasy - Adventures in Etheirys]: CONFIGURING DAILIES!");
        configureDailies.elezen();
        configureDailies.disciple();
    }
});