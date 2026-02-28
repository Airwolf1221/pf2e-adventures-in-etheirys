export function vitalityVoidImmunity(...args) {
    let damage = args[0];
    const vitalityVoid = ["vitality", "void"];
    const damageType = (damage in CONFIG.PF2E.damageTypes)
        ? damage
        : damage.isOfType("condition")
            ? damage.system.persistent?.damageType ?? null
            : null;

    if (!vitalityVoid.includes((damageType))) return true;

    const ImmunitySetting = game.settings.get("pf2e-adventures-in-etheirys", "vitalityVoidImmunity");
    if (!ImmunitySetting) return !!this.attributes.hp?.negativeHealing;

    return this.modeOfBeing !== "construct";
}