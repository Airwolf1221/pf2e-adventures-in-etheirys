export let configureDailies = {
    'elezen': async function _elezen() {
        const register = game.modules.get('pf2e-dailies')?.api.registerCustomDailies;
        if (!register) return;

        const dailyHelpers = game.modules.get('pf2e-dailies').api.dailyHelpers;
        const astrologyUUID = "Compendium.pf2e-adventures-in-etheirys.feats.Item.je7qeZGJANF42zK2",
        expertAstrologyUUID = "Compendium.pf2e-adventures-in-etheirys.feats.Item.7mm3PjvBmuqPgUR5";

        const astrologyDaily = dailyHelpers.createComboSkillDaily("astrology", astrologyUUID, {rank: 1}),
        expertAstrologyDaily = dailyHelpers.createComboSkillDaily("expert-astrology", expertAstrologyUUID, {rank: 2});

        register([astrologyDaily, expertAstrologyDaily]);
    }
}