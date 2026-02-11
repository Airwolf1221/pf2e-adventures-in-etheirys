const limitBreakRanks = [
    'limit-break-1',
    'limit-break-2',
    'limit-break-3',
    'limit-break-4'
];

const limitBreakRanksMinus4 = [
    'limit-break-1',
    'limit-break-2',
    'limit-break-3'
];

function getLimitBreakLevel(actorLevel) {
    if (actorLevel === 20) return 5
    else if (actorLevel >= 15) return 4;
    else if (actorLevel >= 10) return 3;
    else if (actorLevel >= 5) return 2;
    else return 1;
};

// Decrement the uses of all limit breaks when one LB is used, syncing all limit breaks together
async function decrementUses(item, updates) {
    const actor = item.actor;
    if (!actor) return;

    if (item.system.traits.otherTags.some(t => limitBreakRanks.includes(t))) {
        if (updates.flags?.pf2e?.forcedUpdate) {
            delete updates.flags.pf2e.forcedUpdate;
            return updates;
        }

        if (updates.system?.frequency?.value > item.system.frequency?.value) return;

        const lbUses = actor.system.resources.lbUses.value, newLbUses = lbUses - 1;
        let newUses = undefined;

        if (!item.system.traits.otherTags.includes('limit-break-4')) {
            newUses = updates.system?.frequency?.value;
            if (lbUses != newLbUses) actor.updateResource('lbUses', newUses, { render: true });
        } else actor.updateResource('lbUses', newLbUses, { render: true });

        if (item.system.traits.otherTags.includes('limit-break-4')) item.update({ "flags.pf2e.dailyLB4Use": true, "flags.pf2e.forcedUpdate": true });

        const otherLimitBreaks = actor.items.filter((i) => i.id != item.id && i.type === 'feat' && i.system.traits.otherTags.some(t => limitBreakRanks.includes(t)));
        if (!otherLimitBreaks) return;

        for (const limitBreak in otherLimitBreaks) {
            if (!otherLimitBreaks[limitBreak].system.traits.otherTags.includes('limit-break-4')) {
                if (newUses != undefined) otherLimitBreaks[limitBreak].update({ "system.frequency.value": newUses, "flags.pf2e.forcedUpdate": true });
            } else if (newUses === 0) otherLimitBreaks[limitBreak].update({ "system.frequency.value": 0, "flags.pf2e.forcedUpdate": true });
        }
    } else if (item.slug === 'blessing-of-the-limit') {
        let newLbUses = updates.system?.rules?.filter((i) => i.key === 'SpecialResource');
        if (newLbUses?.length === 1) newLbUses = newLbUses[0].value;
        if (!newLbUses) return;

        const limitBreaks = item.actor.items.filter((i) => i.type === "feat" && i.system.traits.otherTags.some(t => limitBreakRanks.includes(t)));
        for (const limitBreak in limitBreaks) {
            if (newLbUses === 0) limitBreaks[limitBreak].update({ "system.frequency.value": 0, "flags.pf2e.forcedUpdate": true });
            else if (!limitBreaks[limitBreak].system.traits.otherTags.includes("limit-break-4")) {
                limitBreaks[limitBreak].update({ "system.frequency.value": newLbUses, "flags.pf2e.forcedUpdate": true });
            } else if (!limitBreaks[limitBreak].flags.pf2e.dailyLB4Use) limitBreaks[limitBreak].update({ "system.frequency.value": 1, "flags.pf2e.forcedUpdate": true });
        }
    }
}

// Reset daily LB4 counter
async function resetLB4(actor) {
    const LB4s = actor.items.filter((i) => i.type === "feat" && i.system.traits.otherTags.includes("limit-break-4"));
    for (const lb4 in LB4s) {
        LB4s[lb4].update({ "flags.pf2e.dailyLB4Use": false, "flags.pf2e.forcedUpdate": true });
    }
}

// Sync effects to last as long as the limit rank dictates
async function syncEffectDuration(effect) {
    const itemType = effect.type;
    if(itemType === 'effect' && effect.system.duration?.unit === 'rounds' && effect.system.duration?.value != 0) {
        const sourceItem = await fromUuid(effect.system.context?.origin?.item);
        if (!sourceItem) return;

        if ((sourceItem.type === 'feat' && sourceItem.system.traits.otherTags.some(t => limitBreakRanksMinus4.includes(t))) || sourceItem.slug === 'beyond-mortal-limits') {
            const limitDuration = getLimitBreakLevel(sourceItem.actor.level), duration = effect.system.duration?.value;
            if (!duration) return;
            return effect.update({ 'system.duration.value': limitDuration });
        }
    } else if (effect.system.traits?.otherTags?.includes("limit-break-1") || effect.system.traits?.otherTags?.includes("limit-break-2") || effect.system.traits?.otherTags?.includes("limit-break-3")) {
        const actorLevel = effect.actor.level;
        if (!actorLevel) return;

        const limitBreakUses = getLimitBreakLevel(actorLevel);
        if (effect.system.frequency.max != limitBreakUses) effect.update({ "system.frequency.max" : limitBreakUses, "system.frequency.value": effect.actor.system.resources.lbUses.value, "flags.pf2e.forcedUpdate": true });
    }
}

// When the actor is updated and has the level changed, update all limit breaks with the new usage, as appropriate.
async function updateActorLBs(actor, changes) {
    const actorLevel = changes?.system?.details?.level?.value;
    if(!actorLevel) return;

    const limitBreaks = actor.items.filter((i) => i.type === 'feat' && i.system.traits.otherTags.some(t => limitBreakRanksMinus4.includes(t)));
    if (!limitBreaks) return;
    
    const limitBreakMaxUses = getLimitBreakLevel(actorLevel);

    for (const limitBreak in limitBreaks) {
        if (limitBreaks[limitBreak].system.frequency.max != limitBreakMaxUses) {
            limitBreaks[limitBreak].update({ "system.frequency.max": limitBreakMaxUses, "system.frequency.value": actor.system.resources.lbUses.value, "flags.pf2e.forcedUpdate": true });
        }
    }
}

export let limitBreaks = {
    'decrementUses': decrementUses,
    'syncEffects': syncEffectDuration,
    'updateActor': updateActorLBs,
    'restLB4Reset': resetLB4
}