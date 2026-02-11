import { helpers } from "../../../helperFuncs.js";

const traitPairs = {
    "Attached": {1: {type: "locked", pairedTrait: ["Ranged Trip", "Two-Handed d8", "Two-Handed d10", "Two-Handed d12"]}},
    "Brace": {1: {type: "cost-change", pairedTrait: "Attached", value: 2}},
    // Capacity
    "Capacity 2": {1: {type: "locked", pairedTrait: ["Capacity 3", "Capacity 4", "Capacity 5", "Repeating"]}},
    "Capacity 3": {1: {type: "locked", pairedTrait: ["Capacity 2", "Capacity 4", "Capacity 5", "Repeating"]}},
    "Capacity 4": {1: {type: "locked", pairedTrait: ["Capacity 2", "Capacity 3", "Capacity 5", "Repeating"]}},
    "Capacity 5": {1: {type: "locked", pairedTrait: ["Capacity 2", "Capacity 3", "Capacity 4", "Repeating"]}},
    "Concussive": {1: {type: "special", value: "concussive"}},
    // Deadly
    "Deadly d4": {1: {type: "locked", pairedTrait: ["Fatal d8", "Fatal d10", "Fatal d12", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Deadly d6": {1: {type: "locked", pairedTrait: ["Fatal d8", "Fatal d10", "Fatal d12", "Deadly d4", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Deadly d8": {1: {type: "locked", pairedTrait: ["Fatal d8", "Fatal d10", "Fatal d12", "Deadly d4", "Deadly d6", "Deadly d10", "Deadly d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Deadly d10": {1: {type: "locked", pairedTrait: ["Fatal d8", "Fatal d10", "Fatal d12", "Deadly d4", "Deadly d6", "Deadly d8", "Deadly d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Deadly d12": {1: {type: "locked", pairedTrait: ["Fatal d8", "Fatal d10", "Fatal d12", "Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Fatal Aim d10", "Fatal Aim d12"]}},
    // Fatal
    "Fatal d8": {1: {type: "locked", pairedTrait: ["Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal d10", "Fatal d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Fatal d10": {1: {type: "locked", pairedTrait: ["Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal d8", "Fatal d12", "Fatal Aim d10", "Fatal Aim d12"]}},
    "Fatal d12": {1: {type: "locked", pairedTrait: ["Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal d8", "Fatal d10", "Fatal Aim d10", "Fatal Aim d12"]}},
    // Fatal Aim
    "Fatal Aim d10": {1: {type: "locked", pairedTrait: ["Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal d8", "Fatal d10", "Fatal d12", "Fatal Aim d12"]}},
    "Fatal Aim d12": {1: {type: "locked", pairedTrait: ["Deadly d4", "Deadly d6", "Deadly d8", "Deadly d10", "Deadly d12", "Fatal d8", "Fatal d10", "Fatal d12", "Fatal Aim d10"]}},
    "Free-Hand": {1: {type: "cost-change", pairedTrait: "Attached", value: 0}},
    "Ranged Trip": {1: {type: "requiresAny", pairedTrait: ["Trip","Thrown"], exclusion: "melee"}, 2: {type: "locked", pairedTrait: "Attached"}},
    "Repeating": {1: {type: "locked", pairedTrait: ["Capacity 2", "Capacity 3", "Capacity 4", "Capacity 5"]}},
    "Tethered": {1: {type: "cost-change", pairedTrait: "Attached", value: 2}},
    // Thrown
    "Thrown 10 ft.": {1: {type: "locked", pairedTrait: ["Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft."]}},
    "Thrown 15 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft."]}},
    "Thrown 20 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft."]}},
    "Thrown 30 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft."]}},
    "Thrown 40 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 50 ft.", "Thrown 60 ft."]}},
    "Thrown 50 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 60 ft."]}},
    "Thrown 60 ft.": {1: {type: "locked", pairedTrait: ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft."]}},
    "Twin": {1: {type: "cost-change", pairedTrait: "Agile", value: 2}},
    // Two-Handed
    "Two-Handed d6": {1: {type: "locked", pairedTrait: ["Attached", "Two-Handed d8", "Two-Handed d10", "Two-Handed d12"]}},
    "Two-Handed d8": {1: {type: "locked", pairedTrait: ["Attached", "Two-Handed d6", "Two-Handed d10", "Two-Handed d12"]}},
    "Two-Handed d10": {1: {type: "locked", pairedTrait: ["Attached", "Two-Handed d6", "Two-Handed d8", "Two-Handed d12"]}},
    "Two-Handed d12": {1: {type: "locked", pairedTrait: ["Attached", "Two-Handed d6", "Two-Handed d8", "Two-Handed d10"]}},
    // Versatile
    "Versatile B": {1: {type: "locked", pairedTrait: ["Versatile P", "Versatile S"]}},
    "Versatile P": {1: {type: "locked", pairedTrait: ["Versatile B", "Versatile S"]}},
    "Versatile S": {1: {type: "locked", pairedTrait: ["Versatile B", "Versatile P"]}}
};

async function onToolCreation(item) {
    if (item.slug !== "multi-tool") return;
    const actor = item.actor, skysteelInvention = helpers.getFeatureBySlug(actor, 'Skysteel Multi-Tool'),
    magitekMechtech = helpers.getFeatureBySlug(actor, 'Magitek Mechtech'), multiToolExpertise = helpers.getFeatureBySlug(actor, "Multi-Tool Expertise"),
    magitekToolDev = helpers.getFeatureBySlug(actor, 'Magitek Tool Development'), skySteelIntegration = helpers.getFeatureBySlug(actor, 'Skysteel Integration');

    let TP;
    if (skysteelInvention || skySteelIntegration) TP = 12;
    else if (magitekMechtech && !magitekToolDev) TP = 8;
    else if (actor.class?.slug === 'engineer' || multiToolExpertise || magitekToolDev) TP = 10;
    else TP = 8;

    // Lower the TP for archetype multi-tools and multi-tools from the multiple tools feat, while covering the unique skysteel clause for that feat
    const mainToolUuid = actor.flags.pf2e.multiToolId, dualPurposeToolUuid = actor.flags.pf2e.dualPurposeMultiToolId ?? "undefined";
    const secondSkysteelToolUuid = actor.flags.pf2e.secondSkysteelMultiToolId, pawnToolUuid = actor.flags.pf2e.pawnToolUuid;
    if (mainToolUuid !== item.id && dualPurposeToolUuid != item.id && pawnToolUuid != item.id) {
        if (secondSkysteelToolUuid === item.id) TP = 8;
        else TP = 6;
        item.update({ "system.category": "martial" });
    }

    const creationDialogContent = `
    <p>Choose the damage type of your multi-tool from the drop-down below.<br>Physical damage costs no TP, while elemental damage costs <b>4 TP</b>.<br><br>
    Also choose if you want your multi-tool to be a melee or a ranged weapon.<br><br>Your weapon currently has <b>${TP} TP</b> to spend.</p>
    <div style="margin-bottom: 10px;">
        <label for="damage-select" style="display: block; margin-bottom:5px;">Select Damage Type:</label>
        <select name="choice" id="damage-select" style="width: 100%;">
            <option value="bludgeoning">Bludgeoning (0 TP)</option>
            <option value="piercing">Piercing (0 TP)</option>
            <option value="slashing">Slashing (0 TP)</option>
            <option value="fire">Fire (4 TP)</option>
            <option value="electricity">Lightning (4 TP)</option>
            <option value="cold">Ice (4 TP)</option>
            <option value="earth-ff">Earth (4 TP)</option>
            <option value="water-ff">Water (4 TP)</option>
            <option value="wind-ff">Wind (4 TP)</option>
        </select>
    </div>`;
    
    const creationDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Damage Type & Category"},
        content: creationDialogContent,
        buttons: [{
            action: "melee",
            label: "Melee",
            default: false,
            callback: (event, button, dialog) => ["meleeWeapon",new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },{
            action: "ranged",
            label: "Ranged",
            default: false,
            callback: (event, button, dialog) => ["rangedWeapon",new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },]
    });

    if(!creationDialog) return;
    const weaponCategory = creationDialog[0], damageType = creationDialog[1];
    if(["fire","electricity","cold","earth-ff","water-ff","wind-ff"].includes(damageType)) TP -= 4;
    
    item.update({ "system.damage.damageType": damageType });
    if (weaponCategory === "meleeWeapon") meleeTool(item, TP);
    else if (weaponCategory === "rangedWeapon") rangedTool(item, TP);
}

async function rangedTool(tool, currentTP) {
    const weaponGroupDialogContent = `
    <p>Choose if you want your weapon to be <b>one-handed</b>, <b>1+-handed</b> (meaning it can be held in one hand, but requires the other hand free to Strike with it),<br>
    or <b>two-handed</b>. If you choose 1+-handed, your weapon gains <b>1 extra TP</b>, and if you choose two-handed, your weapon gains <b>2 extra TP</b>.<br><br>
    Additionally, choose the weapon group for your multi-tool to be a part of. This costs no TP, but if you choose a Firearm, you gain 1 TP</p>
    <div style="margin-bottom: 10px;">
        <label for="group-select" style="display: block; margin-bottom:5px;">Select Weapon Group: (Your weapon has <b>${currentTP} TP</b> available)</label>
        <select name="choice" id="group-select" style="width: 100%;">
            <option value="bow">Bow</option>
            <option value="crossbow">Crossbow</option>
            <option value="dart">Dart</option>
            <option value="sling">Sling</option>
            <option value="firearm">Firearm</option>
        </select>
    </div>`;
    
    const weaponGroupDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Handedness & Category"},
        content: weaponGroupDialogContent,
        buttons: [{
            action: "onehand",
            label: "One-Handed",
            default: false,
            callback: (event, button, dialog) => [1,new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },{
            action: "one+hand",
            label: "1+ Handed",
            default: false,
            callback: (event, button, dialog) => [1.5,new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },{
            action: "twohand",
            label: "Two-Handed",
            default: false,
            callback: (event, button, dialog) => [2,new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },]
    });
    
    if(!weaponGroupDialog) return;
    const handedNess = weaponGroupDialog[0], group = weaponGroupDialog[1];
    let handsString;

    if (group === 'firearm') currentTP += 1;
    if (handedNess === 1.5) currentTP += 1;
    else if (handedNess === 2) currentTP += 2;
    if (handedNess === 1) handsString = 'held-in-one-hand';
    else if (handedNess === 1.5) handsString = 'held-in-one-plus-hands';
    else handsString = 'held-in-two-hands';

    if (handedNess != 1.5) tool.update({ "system.bulk.value": handedNess, "system.group": group, "system.usage.value": handsString });
    else tool.update({ "system.bulk.value": 1, "system.group": group, "system.usage.value": handsString });

    let rangeDialogContent = `
    <p>Choose your tool's range increment. A range increment of 10 ft, 15 ft, or 20 ft costs no TP, while anything greater costs increasing amounts of TP.<br>
    Also choose your tool's reload value. Reload 0 is the default, while Reload 1 and Reload 2 grant you <b>3</b> and <b>6 TP</b> respectively.<br><br>
    Finally, determine if your tool will gain the Volley 30 feet trait, representing reduced accuracy. If it will, it gains another <b>3 TP</b></p>
    <div style="margin-bottom: 10px;">
        <label for="range-select" style="display: block; margin-bottom:5px;">Select Range Increment: (Your weapon has <b>${currentTP} TP</b> available)</label>
        <select name="range" id="range-select" style="width: 100%;">
            <option value="10">10 feet (0 TP)</option>
            <option value="15">15 feet (0 TP)</option>
            <option value="20">20 feet (0 TP)</option>`

    
    if (currentTP >= 1) rangeDialogContent += `<option value="30">30 feet (1 TP)</option><option value="40">40 feet (1 TP)</option><option value="50">50 feet (1 TP)</option>`
    if (currentTP >= 2) rangeDialogContent += `<option value="60">60 feet (2 TP)</option><option value="70">70 feet (2 TP)</option><option value="80">80 feet (2 TP)</option><option value="90">90 feet (2 TP)</option><option value="100">100 feet (2 TP)</option><option value="110">110 feet (2 TP)</option>`
    if (currentTP >= 3) rangeDialogContent += `<option value="120">120 feet (3 TP)</option><option value="140">140 feet (3 TP)</option><option value="150">150 feet (3 TP)</option><option value="180">180 feet (3 TP)</option>`
    if (currentTP >= 4) rangeDialogContent += `<option value="200">200 feet (4 TP)</option><option value="240">240 feet (4 TP)</option>`
    if (currentTP >= 5) rangeDialogContent += `<option value="300">300 feet (5 TP)</option>`

    rangeDialogContent += `</select></div>
    <div style="margin-bottom: 10px;">
        <label for="reload-select" style="display: block; margin-bottom:5px;">Select Reload Value:</label>
        <select name="reload" id="reload-select" style="width: 100%;">
            <option value="0">Reload 0 (0 TP)</option>
            <option value="1">Reload 1 (Gain 3 TP)</option>
            <option value="2">Realod 2 (Gain 6 TP)</option>
        </select>
    </div>`

    const rangeDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Range, Reload & Volley"},
        content: rangeDialogContent,
        buttons: [{
            action: "volley",
            label: "Volley",
            default: true,
            callback: (event, button, dialog) => ["volley-30",new foundry.applications.ux.FormDataExtended(button.form).object.range, new foundry.applications.ux.FormDataExtended(button.form).object.reload]
        },{
            action: "novolley",
            label: "No Volley",
            default: true,
            callback: (event, button, dialog) => ["noVolley",new foundry.applications.ux.FormDataExtended(button.form).object.range, new foundry.applications.ux.FormDataExtended(button.form).object.reload]
        }]
    });

    if (!rangeDialog) return;
    const volley = rangeDialog[0], rangeIncrement = parseInt(rangeDialog[1]), reloadValue = parseInt(rangeDialog[2]);
    
    // Apply volley trait if selected and add the TP
    if (volley === 'volley-30') {
        let toolTraits = tool.system.traits.value
        toolTraits.push('volley-30');
        await tool.update({ "system.traits.value": toolTraits });
        currentTP += 3;
    }

    // Decrement Range cost from TP
    if (rangeIncrement >= 260) currentTP -= 5;
    else if (rangeIncrement <= 250 && rangeIncrement >= 190) currentTP -= 4;
    else if (rangeIncrement <= 180 && rangeIncrement >= 120) currentTP -= 3;
    else if (rangeIncrement <= 110 && rangeIncrement >= 60) currentTP -= 2;
    else if (rangeIncrement <= 50 && rangeIncrement >= 30) currentTP -= 1;

    // Add Reload TP
    if (reloadValue === 2) currentTP += 6;
    else if (reloadValue === 1) currentTP += 3;

    // Update the item with the range and reload
    tool.update({ "system.range": rangeIncrement, "system.reload.value": rangeDialog[2]});

    let damageDiceDialogContent = `
    <p>Choose your tool's damage die. Your tool starts with a d4 damage die, and it costs <b>3 TP</b> per step increase.<br><br>
    If you chose a one-handed or 1+-handed weapon, the maximum possible die size is d8, otherwise it's d10 for a 2 handed weapon.</p>
    <div style="margin-bottom: 10px;">
        <label for="die-size-select" style="display: block; margin-bottom:5px;">Select Damage Die Size: (Your weapon has <b>${currentTP} TP</b> available)</label>
        <select name="choice" id="die-size-select" style="width: 100%;">
            <option value="d4">d4 (0 TP)</option>`;

    if (currentTP >= 3) damageDiceDialogContent+= `<option value="d6">d6 (3 TP)</option>`
    if (currentTP >= 6) damageDiceDialogContent+= `<option value="d8">d8 (6 TP)</option>`
    if (currentTP >= 9 && handedNess === 2) damageDiceDialogContent+= `<option value="d10">d10 (9 TP)</option>`

    damageDiceDialogContent+= `</select></div>`

    const damageDiceDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Damage Die Size"},
        content: damageDiceDialogContent,
        buttons: [{
            action: "choice",
            label: "Ok",
            default: true,
            callback: (event, button, dialog) => [new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        }]
    });
    
    if(!damageDiceDialog) return;
    const damageDie = damageDiceDialog[0];

    if (damageDie === 'd6') currentTP -= 3;
    else if (damageDie === 'd8') currentTP -= 6;
    else if (damageDie === 'd10') currentTP -= 9;

    await tool.update({ "system.damage.die": damageDie, "flags.pf2e.engineer.remainingTP": currentTP });

    if (currentTP === 0) {
        ui.notifications.notify('Your weapon is out of TP, and cannot receive any traits!');
        return;
    } else toolTraits(tool, 'ranged');
}

async function meleeTool(tool, currentTP) {
    const weaponGroupDialogContent = `
    <p>Choose if you want your weapon to be <b>one-handed</b> or <b>two-handed</b>.<br>If you choose two-handed, your weapon gains <b>6 extra TP</b>.<br><br>
    Additionally, choose the weapon group for your multi-tool to be a part of. This costs no TP.</p>
    <div style="margin-bottom: 10px;">
        <label for="group-select" style="display: block; margin-bottom:5px;">Select Weapon Group: (Your weapon has <b>${currentTP} TP</b> available)</label>
        <select name="choice" id="group-select" style="width: 100%;">
            <option value="axe">Axe</option>
            <option value="brawling">Brawling</option>
            <option value="club">Club</option>
            <option value="dart">Dart</option>
            <option value="flail">Flail</option>
            <option value="knife">Knife</option>
            <option value="hammer">Hammer</option>
            <option value="pick">Pick</option>
            <option value="polearm">Polearm</option>
            <option value="spear">Spear</option>
            <option value="sword">Sword</option>
        </select>
    </div>`;
    
    const weaponGroupDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Handedness & Category"},
        content: weaponGroupDialogContent,
        buttons: [{
            action: "onehand",
            label: "One-Handed",
            default: false,
            callback: (event, button, dialog) => [1,new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },{
            action: "twohand",
            label: "Two-Handed",
            default: false,
            callback: (event, button, dialog) => [2,new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        },]
    });

    if(!weaponGroupDialog) return;
    const handedNess = weaponGroupDialog[0], group = weaponGroupDialog[1];
    let handsString;

    if (handedNess === 2) currentTP += 6;
    if (handedNess === 1) handsString = 'held-in-one-hand';
    else handsString = 'held-in-two-hands';

    tool.update({ "system.bulk.value": handedNess, "system.group": group, "system.usage.value": handsString });

    let damageDiceDialogContent = `
    <p>Choose your tool's damage die. Your tool starts with a d4 damage die, and it costs <b>3 TP</b> per step increase.<br><br>
    If you chose a one-handed weapon, the maximum possible die size is d8, otherwise it's d12.</p>
    <div style="margin-bottom: 10px;">
        <label for="die-size-select" style="display: block; margin-bottom:5px;">Select Damage Die Size: (Your weapon has <b>${currentTP} TP</b> available)</label>
        <select name="choice" id="die-size-select" style="width: 100%;">
            <option value="d4">d4 (0 TP)</option>`;

    if (currentTP >= 3) damageDiceDialogContent+= `<option value="d6">d6 (3 TP)</option>`
    if (currentTP >= 6) damageDiceDialogContent+= `<option value="d8">d8 (6 TP)</option>`
    if (currentTP >= 9 && handedNess === 1) damageDiceDialogContent+= `<option value="d10">d10 (9 TP)</option>`
    if (currentTP >= 12 && handedNess === 2) damageDiceDialogContent+= `<option value="d12">d12 (12 TP)</option>`

    damageDiceDialogContent+= `</select></div>`

    const damageDiceDialog = await foundry.applications.api.DialogV2.wait({
        window: {title: "Damage Die Size"},
        content: damageDiceDialogContent,
        buttons: [{
            action: "choice",
            label: "Ok",
            default: true,
            callback: (event, button, dialog) => [new foundry.applications.ux.FormDataExtended(button.form).object.choice]
        }]
    });

    if(!damageDiceDialog) return;
    const damageDie = damageDiceDialog[0];

    if (damageDie === 'd6') currentTP -= 3;
    else if (damageDie === 'd8') currentTP -= 6;
    else if (damageDie === 'd10') currentTP -= 9;
    else if (damageDie === 'd12') currentTP -= 12;

    await tool.update({ "system.damage.die": damageDie, "flags.pf2e.engineer.remainingTP": currentTP });

    if (currentTP === 0) {
        ui.notifications.notify('Your weapon is out of TP, and cannot receive any traits!');
        return;
    } else toolTraits(tool, 'melee');
}

async function toolTraits(tool, toolType) {
    let currentTP = tool.flags?.pf2e?.engineer?.remainingTP;
    if (!currentTP) return;
    const traitIndex = prepareTraitIndex(toolType, tool);

    const objIndex = Object.fromEntries(traitIndex)
    let traitObj = Object.fromEntries(Object.entries(objIndex).map(([key,[cost,note]]) => (note === "-" ? [key.toLowerCase(), {label: `${key} (${cost} TP)`}] : [key.toLowerCase(), {label: `${key} (${cost} TP) - ${note}`}])));

    const field = new foundry.data.fields.SetField(new foundry.data.fields.StringField({
        choices: traitObj,
    }), {
        label: "Traits",
        hint: "These are the traits your weapon can select"
    });

    const formGroup = field.toFormGroup({
        classes: ["stacked"],
    }, {
        name: "choices",
        value: Object.entries(traitObj).filter(c => c[1].checked).map(c => c[0]),
        type: "checkboxes",
    }).outerHTML;

    function render(event, dialog) {
        const box = dialog.element.querySelector("[name=choices]");
        const button = dialog.element.querySelector(".form-footer button");
        updateCheckboxStates(dialog, box, button, traitIndex, tool, toolType, currentTP);

        box.addEventListener("change", event => {
            updateCheckboxStates(dialog, box, button, traitIndex, tool, toolType, currentTP);
        })
    }

    const traitsDialog = await foundry.applications.api.DialogV2.prompt({
        content: `<p class="TP Cost">TP Budget: 0 / ${currentTP}</p><fieldset>${formGroup}</fieldset>`,
        rejectClose: false,
        modal: true,
        render: render,
        ok: {callback: (event, button) => [button.form.elements.choices.expendedTP, button.form.elements.choices.value]},
        window: {title: "Trait Selection Dialog"},
        position: {width: 900, height: "auto"},
    });
    if (!traitsDialog) return;

    let expendedTP = traitsDialog[0];
    let traits = tool.system.traits.value;

    for (const trait in traitsDialog[1]) {
        if (["thrown 10 ft.", "thrown 15 ft.", "thrown 20 ft.", "thrown 30 ft.", "thrown 40 ft.", "thrown 50 ft.", "thrown 60 ft."].includes(traitsDialog[1][trait])) {
            traits.push(traitsDialog[1][trait].substring(0, 9).replaceAll(' ', '-'));
        } else if (["two-handed d6", "two-handed d8", "two-handed d10", "two-handed d12"].includes(traitsDialog[1][trait])) {
            traits.push(traitsDialog[1][trait].substring(0, 8).replaceAll(' ', '-') + '-' + traitsDialog[1][trait].substring(11));
        }  else traits.push(traitsDialog[1][trait].replaceAll(' ', '-'));
    }

    tool.update({ "system.traits.value": traits, "flags.pf2e.engineer.remainingTP": currentTP - expendedTP });
    if (toolType === 'ranged') addAmmunitionFormula(tool, tool.actor);
}

function updateCheckboxStates(dialog, box, button, traitIndex, tool, toolType, currentTP) {
    const selectedTraits = box.value, TPCost = dialog.element.querySelector(`[class="TP Cost"]`);
    let expendedTP = 0, baseTraitCosts = {};
    for (const [key, [cost, notes]] of traitIndex.entries()) {
        if (selectedTraits.includes(key.toLowerCase())) {
            expendedTP += cost;
        }
        baseTraitCosts[key] = {cost: cost, notes: notes};
    }

    for (const trait in traitPairs) {
        const checkBox = box.querySelector(`[value="${trait.toLowerCase()}"]`);
        if (!checkBox) continue;
        let newHTML = `${trait} (${baseTraitCosts[trait].cost} TP)`;
        if (Object.keys(traitPairs[trait]).length > 1) {
            let anyLock = false;
            for (const pairing in traitPairs[trait]) {
                const pairingData = traitPairs[trait][pairing];
                const toolTraits = tool.system.traits.value;
                const change = extractPairingData(pairingData, selectedTraits, toolTraits, toolType);
                if (typeof change === 'number') {
                    const aggregratedChange = change - baseTraitCosts[trait].cost;
                    if(selectedTraits.includes(trait.toLowerCase())) expendedTP += aggregratedChange;
                    newHTML = `${trait} (${change} TP)`;
                } else if (typeof change === 'string') {
                    if (!anyLock && change === 'locked') anyLock = true;
                    if (change === 'concussive') {
                        const reloadValue = parseInt(tool.system.reload.value), damageDie = tool.system.damage.die;
                        let kickbackAttached = selectedTraits.includes('kickback') ?? toolTraits.includes('kickback');
                        if (!kickbackAttached) kickbackAttached = selectedTraits.includes('attached') ?? toolTraits.includes('attached');
                        let traitValue = 2;

                        if (reloadValue > 0 && ['d8','d10'].includes(damageDie) && kickbackAttached) traitValue = 0;
                        else if (reloadValue > 0 && ['d8','d10'].includes(damageDie)) traitValue = 1;
                        const aggregratedChange = traitValue - baseTraitCosts[trait].cost;
                        if (selectedTraits.includes(trait.toLowerCase())) expendedTP += aggregratedChange;
                        newHTML = `${trait} (${traitValue} TP)`;
                    }
                }
            }
            checkBox.disabled = anyLock;
        } else {
            const pairing = traitPairs[trait][1];
            const toolTraits = tool.system.traits.value;
            const change = extractPairingData(pairing, selectedTraits, toolTraits, toolType);
            if (typeof change === 'number') {
                const aggregratedChange = change - baseTraitCosts[trait].cost;
                if(selectedTraits.includes(trait.toLowerCase())) expendedTP += aggregratedChange;
                newHTML = `${trait} (${change} TP)`;
            } else if (typeof change === 'string') {
                checkBox.disabled = change === "locked";
                if (checkBox.disabled) checkBox.checked = false;
                if (change === 'concussive') {
                    const reloadValue = parseInt(tool.system.reload.value), damageDie = tool.system.damage.die;
                    let kickbackAttached = selectedTraits.includes('kickback') ?? toolTraits.includes('kickback');
                    if (!kickbackAttached) kickbackAttached = selectedTraits.includes('attached') ?? toolTraits.includes('attached');
                    let traitValue = 2;

                    if (reloadValue > 0 && ['d8','d10'].includes(damageDie) && kickbackAttached) traitValue = 0;
                    else if (reloadValue > 0 && ['d8','d10'].includes(damageDie)) traitValue = 1;
                    const aggregratedChange = traitValue - baseTraitCosts[trait].cost;
                    if (selectedTraits.includes(trait.toLowerCase())) expendedTP += aggregratedChange;
                    newHTML = `${trait} (${traitValue} TP)`;
                }
            }
        }
        if (baseTraitCosts[trait].notes != '-') newHTML += ` - ${baseTraitCosts[trait].notes}`;
        checkBox.parentElement.childNodes[1].textContent = newHTML;
    }

    if (expendedTP > currentTP) TPCost.innerText = `TP Budget: OVERSPENDING TP (${expendedTP} / ${currentTP})`;
    else TPCost.innerText = `TP Budget: ${expendedTP} / ${currentTP}`;

    button.disabled = expendedTP > currentTP;
    button.form.elements.choices.expendedTP = expendedTP;
}

function addAmmunitionFormula(tool, actor) {
    const arrowUuid = "Compendium.pf2e.equipment-srd.Item.w2ENw2VMPcsbif8g",
    boltsUuid = "Compendium.pf2e.equipment-srd.Item.AITVZmakiu3RgfKo",
    roundsUuid = "Compendium.pf2e-adventures-in-etheirys.equipment.Item.ntdE7ydolghi11SF",
    magazineUuid = "Compendium.pf2e-adventures-in-etheirys.equipment.Item.bMfvAwjSufVEkaVY";

    const toolGroup = tool.system.group, toolTraits = tool.system.traits.value;
    let uuid, ammoType;
    if (toolGroup === 'firearm') {
        uuid = roundsUuid;
        ammoType = "rounds-multi-tool";
    } else if (toolGroup === 'crossbow') {
        uuid = boltsUuid; 
        ammoType = "bolts";
    } else {
        uuid = arrowUuid;
        ammoType = "arrows";
    }

    const newFormula = { uuid };
    const mainToolUuid = actor.flags.pf2e.multiToolId;
    let updatedFormulaObject = [...actor.system.crafting.formulas, newFormula];
    if (toolTraits.includes("repeating")) {
        uuid = magazineUuid;
        updatedFormulaObject = [...updatedFormulaObject, { uuid }];
        ammoType = "multi-tool-magazine";
    }
    if (tool.id === mainToolUuid) actor.update({ 'system.crafting.formulas': updatedFormulaObject });
    tool.update({ "system.ammo.baseType": ammoType });
}

function extractPairingData(pairing, selectedTraits, toolTraits, toolType) {
    const pairingType = pairing.type, pairedTrait = pairing.pairedTrait, pairingValue = pairing.value;
    if (pairedTrait) {
        if (pairedTrait.includes("Thrown")) {
            if (pairedTrait.length === 1) pairedTrait = ["Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft."]
            else {
                pairedTrait.splice(pairedTrait.indexOf("Thrown"),1);
                pairedTrait.push("Thrown 10 ft.", "Thrown 15 ft.", "Thrown 20 ft.", "Thrown 30 ft.", "Thrown 40 ft.", "Thrown 50 ft.", "Thrown 60 ft.");
            }
        }
    }

    switch (pairingType) {
        case "cost-change":
            if (typeof pairedTrait === 'string') if (selectedTraits.includes(pairedTrait.toLowerCase()) || toolTraits.includes(pairedTrait.toLowerCase().replaceAll(' ', '-'))) return pairingValue;
            else for (const trait in pairedTrait) if (selectedTraits.includes(pairedTrait[trait].toLowerCase()) || toolTraits.includes(pairedTrait[trait].toLowerCase().replaceAll(' ', '-'))) return pairingValue;
            break;
        case "requiresAny":
            if (typeof pairedTrait === 'string') {
                if (pairing.exclusion != toolType) return "unlocked";
                if (selectedTraits.includes(pairedTrait.toLowerCase()) || toolTraits.includes(pairedTrait.toLowerCase().replaceAll(' ', '-'))) return "unlocked";
                else return "locked";
            }
            else {
                if (pairing.exclusion != toolType) return "unlocked";
                for (const trait in pairedTrait) if (selectedTraits.includes(pairedTrait[trait].toLowerCase()) || toolTraits.includes(pairedTrait[trait].toLowerCase().replaceAll(' ', '-'))) return "unlocked";
                return "locked";
            }
        case "requiresAll":
            let obtainedTraits = 0;
            for (const trait in pairedTrait) if (selectedTraits.includes(pairedTrait[trait].toLowerCase()) || toolTraits.includes(pairedTrait[trait].toLowerCase().replaceAll(' ', '-'))) obtainedTraits++;
            if (obtainedTraits === pairedTrait.length) return "unlocked";
            else return "locked";
        case "locked":
            if (typeof pairedTrait === 'string') if (selectedTraits.includes(pairedTrait.toLowerCase()) || toolTraits.includes(pairedTrait.toLowerCase().replaceAll(' ', '-'))) return "locked";
            for (const trait in pairedTrait) if (selectedTraits.includes(pairedTrait[trait].toLowerCase()) || toolTraits.includes(pairedTrait[trait].toLowerCase().replaceAll(' ', '-'))) return "locked";
            return "unlocked";
        case "special":
            return pairingValue;
    }
}

function prepareTraitIndex(toolType, tool) {
    const hands = tool.system.usage.hands, dieSize = tool.system.damage.die, actor = tool.actor;
    // Pull Skysteel Modifications
    const skysteelInvention = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.8hdUkjcsnA5Acine")[0] ? true: false;
    // Pull Additional Multi-Tools Feat
    const additionalMultiTools = actor.items.filter((i) => i.sourceId === "")[0] ? true: false;
    // Initial
    const bluntShot = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.UOavXsgGKwuDhMGZ")[0] ? true : false;
    const entanglingTool = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.lmfSsbnOK9dMvElJ")[0] ? true : false;
    const hamperingTool = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.FU9Ddz3KodMioguf")[0] ? true : false;
    const modularHead = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.5xIwGbfrV2OVRV0y")[0] ? true : false;
    const pacificationTools = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.UbQgV5NyNht3o1kz")[0] ? true : false;
    const razorProngs = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.wckjrxWOkWb5dIG3")[0] ? true : false;
    const segmentedTool = actor.items.filter((i) => i.sourceId === "Compendium.pf2e-adventures-in-etheirys.class-features.Item.RyugAXTdbmuJGYwD")[0] ? true : false;
    // Breakthrough
    const advancedRangefinder = actor.items.filter((i) => i.sourceId === "")[0] ? true : false;
    const ropeShot = actor.items.filter((i) => i.sourceId === "")[0] ? true : false;
    const tangleLine = actor.items.filter((i) => i.sourceId === "")[0] ? true : false;
    // Create blank trait index map
    const traitIndex = new Map();
    // Universal Traits
    // Agile
    if (dieSize === 'd4') traitIndex.set('Agile', [1,"-"]);
    else if (dieSize === 'd6') traitIndex.set('Agile', [1,"-"]);
    // Deadly
    traitIndex.set('Deadly d4', [2,"Mutually exclusive with fatal and fatal aim"]);
    traitIndex.set('Deadly d6', [2,"Mutually exclusive with fatal and fatal aim"]);
    traitIndex.set('Deadly d8', [2,"Mutually exclusive with fatal and fatal aim"]);
    if (["d10","d12"].includes(dieSize)) traitIndex.set('Deadly d10', [2,"Mutually exclusive with fatal and fatal aim"]);
    else if (dieSize != 'd4') traitIndex.set('Deadly d10', [3,"Mutually exclusive with fatal and fatal aim"]);
    if (dieSize === 'd12') traitIndex.set('Deadly d12', [2,"Mutually exclusive with fatal and fatal aim"]);
    else if (!['d4','d6'].includes(dieSize)) traitIndex.set('Deadly d12', [3,"Mutually exclusive with fatal and fatal aim"]);
    // Fatal
    traitIndex.set('Fatal d8', [3,"Mutually exclusive with deadly and fatal aim"]);
    if (["d6","d8","d10","d12"].includes(dieSize)) traitIndex.set('Fatal d10', [3,"Mutually exclusive with deadly and fatal aim"]);
    if (["d8","d10","d12"].includes(dieSize)) traitIndex.set('Fatal d12', [3,"Mutually exclusive with deadly and fatal aim"]);
    if (modularHead || segmentedTool) traitIndex.set('Modular', [2,"-"]);
    if (segmentedTool) traitIndex.set('Concealable', [2,"-"]);

    // Melee-exclusive traits
    if (toolType === 'melee') {
        traitIndex.set('Attached', [3,"Allows for attachment to the magitek mech's weapon mount. Mutually exclusive with ranged trip"]);
        traitIndex.set('Backstabber', [1,"-"]);
        traitIndex.set('Backswing', [2,"-"]);
        traitIndex.set('Brace', [1,"2 if combined with attached, otherwise 1"]);
        if (ropeShot) traitIndex.set('Climbing', [1,"-"]);
        if (entanglingTool || pacificationTools) traitIndex.set('Disarm', [1,"-"]);
        // Finesse
        if (["d4","d6"].includes(dieSize)) traitIndex.set("Finesse", [1,"-"]);
        else if (dieSize === 'd8') traitIndex.set("Finesse", [2,"-"]);
        traitIndex.set("Forceful", [2,"-"]);
        // Free-Hand
        if (hands === 1) traitIndex.set("Free-Hand", [1,"-"]);
        traitIndex.set("Grapple", [1,"-"]);
        if (hamperingTool || pacificationTools) traitIndex.set('Hampering', [2,"-"]);
        if (additionalMultiTools) traitIndex.set('Injection', [3,"-"]);
        traitIndex.set("Nonlethal", [0,"-"]);
        traitIndex.set("Parry", [2,"-"]);
        traitIndex.set("Ranged Trip", [3,"Requires Trip or Thrown to be selected. Mutually exclusive with attached"]);
        traitIndex.set("Razing", [1,"-"]);
        traitIndex.set("Reach", [3,"-"]);
        if (additionalMultiTools) traitIndex.set('Resonant', [2,"-"]);
        traitIndex.set("Shove", [1,"-"]);
        traitIndex.set("Sweep", [1,"-"]);
        if (razorProngs) traitIndex.set('Tearing', [2,"-"]);
        traitIndex.set("Tethered", [1,"-"]);
        // Thrown
        traitIndex.set("Thrown 10 ft.", [1,"-"]);
        traitIndex.set("Thrown 15 ft.", [1,"-"]);
        traitIndex.set("Thrown 20 ft.", [1,"-"]);
        traitIndex.set("Thrown 30 ft.", [1,"-"]);
        traitIndex.set("Thrown 40 ft.", [2,"-"]);
        traitIndex.set("Thrown 50 ft.", [2,"-"]);
        traitIndex.set("Thrown 60 ft.", [2,"-"]);
        // Trip
        if (hands === 1) traitIndex.set("Trip", [1,"-"]);
        traitIndex.set("Twin", [1,"-"]);
        // Two-Handed
        if (hands === 1) {
            if (dieSize === 'd4') traitIndex.set("Two-Handed d8", [1,"Mutually exclusive with attached"]);
            else if (dieSize === 'd6') traitIndex.set("Two-Handed d10", [1,"Mutually exclusive with attached"]);
            else if (dieSize === 'd8') traitIndex.set("Two-Handed d12", [1,"Mutually exclusive with attached"]);
        }
        // Versatile
        traitIndex.set("Versatile B", [1,"-"]);
        traitIndex.set("Versatile P", [1,"-"]);
        traitIndex.set("Versatile S", [1,"-"]);
    } 
    
    // Ranged-exclusive traits
    else if (toolType === 'ranged') {
        const reload = parseInt(tool.system.reload.value), handedness = tool.system.usage.value;
        // Attached
        if (reload === 0) traitIndex.set('Attached', [3,"Allows for attachment to the magitek mech's weapon mount"]);
        else traitIndex.set('Attached', [2,"Allows for attachment to the magitek mech's weapon mount"]);
        if (advancedRangefinder) traitIndex.set('Backstabber', [1,"-"]);
        // Capacity
        traitIndex.set('Capacity 2', [2,"Mutually exclusive with repeating"]);
        traitIndex.set('Capacity 3', [2,"Mutually exclusive with repeating"]);
        traitIndex.set('Capacity 4', [2,"Mutually exclusive with repeating"]);
        traitIndex.set('Capacity 5', [3,"Mutually exclusive with repeating"]);
        traitIndex.set('Concussive', [2,"0 if d8 damage die or higher, reload is above 0, and the Kickback or Attached trait is present. 1 if d8 damage die or higher and reload is above 0"]);
        traitIndex.set('Double Barrel', [3,"-"]);
        // Fatal Aim
        if (handedness === 'held-in-one-hand' && ["d6","d8"].includes(dieSize)) traitIndex.set('Fatal Aim d10', [3,"Mutually exclusive with deadly and fatal"]);
        if (handedness === 'held-in-one-hand' && ["d8"].includes(dieSize)) traitIndex.set('Fatal Aim d12', [3,"Mutually exclusive with deadly and fatal"]);
        traitIndex.set("Forceful", [1,"-"]);
        traitIndex.set("Free-Hand", [1,"-"]);
        // Kickback
        if (reload === 0 && (dieSize === 'd4' || dieSize === 'd6')) traitIndex.set("Kickback", [2,"-"]);
        else traitIndex.set("Kickback", [1,"-"]);
        traitIndex.set("Nonlethal", [0,"-"]);
        if (tangleLine) traitIndex.set('Parry', [2,"-"]);
        if (additionalMultiTools) traitIndex.set('Propulsive', [1,"-"]);
        if (bluntShot || ropeShot || tangleLine) traitIndex.set("Ranged Trip", [3,"Mutually exclusive with attached"]);
        traitIndex.set("Razing", [1,"-"]);
        // Repeating
        if (reload === 0 && handedness !== "held-in-two-hands") traitIndex.set("Repeating", [2,"-"]);
        else traitIndex.set("Repeating", [1,"-"]);
        // Scatter
        traitIndex.set("Scatter 5 ft.", [4,"-"]);
        traitIndex.set("Scatter 10 ft.", [5,"-"]);
    }

    if (skysteelInvention) {
        const toolTraits = tool.system.traits.value;
        for (const [key] of traitIndex.entries()) {
            if (toolTraits.includes(key.toLowerCase().replaceAll(' ', '-'))) traitIndex.delete(key);
        }
    }

    return traitIndex;
}

export let multiTool = {
    'createTool': onToolCreation
}