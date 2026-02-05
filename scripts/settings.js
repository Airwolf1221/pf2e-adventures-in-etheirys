// Define a constant handle for the module's name to ensure it is accurately represented everywhere.
export const MODULE_NAME = "pf2e-adventures-in-etheirys";
// Setup FF Module Settings
export function registerSettings() {
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
    game.settings.register(MODULE_NAME, "mythic", {
        name: "AIE.Settings.Mythic.Name",
        hint: "AIE.Settings.Mythic.Hint",
        scope: "world",
        type: Boolean,
        config: true,
        default: false,
        requiresReload: true
    });
}