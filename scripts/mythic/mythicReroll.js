const mythicRollDomain = 'ff2e-myth'

async function assignMythicDomain(checkData) {
    const actor = checkData.context.actor;
    if (!actor) return;
    checkData.context.domains.push(mythicRollDomain);
}

async function mythicChatMessage(chatMessage, html) {
    const actor = chatMessage.actor;
    if (!actor || !chatMessage.isRoll) return;
    const isHPReroll = chatMessage.flags.pf2e.context?.options?.includes("check:reroll:hero-points") ?? false, isMythic = chatMessage.flags?.pf2e?.context?.domains?.includes(mythicRollDomain);
    if (!isHPReroll || !isMythic) return;
    const rollData = chatMessage.rolls[0];

    const d20Roll = rollData.dice.find((d) => d instanceof foundry.dice.terms.Die && d.number === 1 && d.faces === 20);
    if (!d20Roll) return;

    const profMod = chatMessage.flags.pf2e.modifiers.find((m) => m.slug === 'proficiency').modifier;
    const mythicModification = 10 + actor.level - profMod;
    const numericAddition = rollData.terms.find((t) => t.number != undefined && !t.faces);
    if (numericAddition) rollData.terms.find((t) => t.number != undefined && !t.faces).number += mythicModification;
    else {
        rollData.terms.push(
            foundry.dice.terms.OperatorTerm.fromData({ class: "OperatorTerm", operator: "+", evaluated: true}),
            foundry.dice.terms.NumericTerm.fromData({ class: "NumericTerm", number: mythicModification, evaluated: true}),
        );
    }
    rollData._total += mythicModification;

    const tags = html.querySelector(".flavor-text > .tags.modifiers");
    const formulaElem = html.querySelector(".reroll-discard .dice-formula");
    const newTotalElem = html.querySelector(".reroll-second .dice-total");

    if (tags && formulaElem && newTotalElem) {
        const profTag = tags.querySelector("[data-slug=proficiency]");
        profTag.innerText = `Mythic +${mythicModification + profMod}`
        profTag.classList.add("mythic-reroll");
        formulaElem.innerText = rollData.formula;
        newTotalElem.innerText = rollData._total;
        newTotalElem.classList.add("mythic-reroll");
    }
}


export let mythicReroll = {
    'assignDomain': assignMythicDomain,
    'chatMessage': mythicChatMessage
};