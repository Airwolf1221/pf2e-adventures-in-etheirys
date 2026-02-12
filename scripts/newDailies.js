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
    },
    'disciple': async function _disciple() {
        const register = game.modules.get('pf2e-dailies')?.api.registerCustomDailies;
        if (!register) return;

        const dailyHelpers = game.modules.get('pf2e-dailies').api.dailyHelpers;
        const utils = game.modules.get('pf2e-dailies').api.utils;

        register ([
            {
                key: 'gift-of-the-land',
                items: [
                    {
                        slug: 'giftOfTheLand',
                        uuid: 'Compendium.pf2e-adventures-in-etheirys.class-features.Item.k5DXFq3nFc32QSZ2',
                        required: true,
                    },
                ],
                label: (actor, items) =>items.giftOfTheLand.name,
                rows: async (actor, items) => {
                    const pack = game.packs.get("pf2e-adventures-in-etheirys.class-features");
                    if (!pack) return;

                    const index = await pack.getIndex({ fields: ["system.traits.otherTags"] });
                    const gifts = index.filter((entry) => entry.system.traits.otherTags?.includes("gift-of-the-land"));
                    const options = gifts.map((e) => ({
                        value: e.uuid,
                        label: e.name
                    }));

                    return [
                        {
                            type: "select",
                            slug: "giftOfTheLand",
                            options: options,
                        }
                    ];
                },
                process: async ({ actor, rows, messages, items, addItem, addFeat, addRule }) => {
                    const parent = items.giftOfTheLand;
                    let itemSource = await utils.getItemSource(rows.giftOfTheLand);
                    addFeat(itemSource, parent);

                    messages.addRaw(
                        `Prepared ${itemSource.name} as their Gift of the Land.`,
                    );
                }
            }
        ])
    }
}