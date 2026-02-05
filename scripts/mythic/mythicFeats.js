import { MODULE_NAME } from "../settings.js";

async function featHandling() {
    const mythicSetting = game.settings.get(MODULE_NAME, 'mythic'), campaignFeatSections = game.settings.get('pf2e', 'campaignFeatSections');
    if (mythicSetting) {
        if (!campaignFeatSections.find((section) => section.id === 'blessingFeats')) {
            campaignFeatSections.push({
                id: 'blessingFeats',
                label: 'Blessing of Light Feats',
                supported: ['blessing'],
                slots: [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
            });
        }
        game.settings.set('pf2e', 'campaignFeatSections', campaignFeatSections);
    } else {
        if (campaignFeatSections.find((section) => section.id === 'blessingFeats')) {
            campaignFeatSections.splice(campaignFeatSections.findIndex((section) => section.id === 'blessingFeats'));
            game.settings.set('pf2e', 'campaignFeatSections', campaignFeatSections);
        }
    }
}

async function featFiltering(sheet) {
    const blessingSlots = sheet.actor.feats.get('blessingFeats');
    if (!blessingSlots) return;

    if (!blessingSlots.filter.traits) {
        sheet.actor.feats.get('blessingFeats').filter.traits = [];
        sheet.actor.feats.get('blessingFeats').filter.traits.push('blessing');
    } else {
        if (sheet.actor.feats.get('blessingFeats').filter.traits.indexOf('blessing') === -1) sheet.actor.feats.get('blessingFeats').filter.traits.push('blessing');
    }
}

export let mythicFeats = {
    'featHandling': featHandling,
    'featFiltering': featFiltering
}