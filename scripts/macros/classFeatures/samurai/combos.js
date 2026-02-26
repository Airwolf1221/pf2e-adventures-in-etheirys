async function incrementComboCounter(chatMessage) {
    if (chatMessage.isRoll) return;

    const actor = chatMessage.actor, item = chatMessage.item;
    if (!actor || !item) return;
    
    const comboAction = item.system.traits.value.includes('combo'), isSamurai = actor.class?.name === "Samurai" ? true : false;
    if (!comboAction || !isSamurai) return;
    
    const comboEffect = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.feat-effects.Item.B8EJDR9YEKyos487")[0];
    if (!comboEffect) {
        const baseComboEffect = await fromUuid("Compendium.pf2e-adventures-in-etheirys.feat-effects.Item.B8EJDR9YEKyos487");
        const effect = await Item.implementation.create(game.items.fromCompendium(baseComboEffect), {parent: actor});
        effect.setFlag('pf2e', 'lastComboAction', item.name);
        
        const awakenedKendo = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.9dsFyzgR2oiAMdyw")[0] ? true: false;
        if (awakenedKendo && item.name === "Hakaze") effect.update({'system.badge.value': 2});
    } else {
        const lastComboAction = comboEffect.getFlag('pf2e', 'lastComboAction'), comboCount = comboEffect.getFlag('pf2e', 'comboCount'),
              comboEffectValue = comboEffect.system.badge.value;
        if (lastComboAction === item.name) return;
        
        let iterationAmount = 1;
        const awakenedKendo = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.9dsFyzgR2oiAMdyw")[0] ? true: false;
        if (awakenedKendo && item.name === "Hakaze") iterationAmount = 2;

        comboEffect.setFlag('pf2e', 'lastComboAction', item.name);
        comboEffect.setFlag('pf2e', 'comboCount', comboCount + 1);
        comboEffect.update({'system.badge.value': comboEffectValue + iterationAmount});
    }
}

export let combos = {
    'incrementCombo': incrementComboCounter
}