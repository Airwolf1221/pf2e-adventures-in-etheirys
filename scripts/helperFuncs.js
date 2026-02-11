function getFeatureBySlug(actor, feature) {
    feature = (feature.replaceAll(' ', '-')).toLowerCase();
    return actor.items.find(i => i.slug === feature);
}

export let helpers = {
    'getFeatureBySlug': getFeatureBySlug
}