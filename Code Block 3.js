function getChestData(x, y, z) {
    let item = api.getStandardChestItemSlot([x, y, z], 0);
    
    if (!item || !item.attributes || !item.attributes.customAttributes) return null;

    return item.attributes.customAttributes;
}

function scanChestToAdmins(x, y, z) {

    const size = 36;

    for (let slot = 0; slot < size; slot++) {

        const item = api.getStandardChestItemSlot([x, y, z], slot);
        if (!item) continue;

        const displayName = item.attributes?.customDisplayName;
        const dbid = item.attributes?.customDescription;

        if (!displayName || !dbid) continue;

        // "Name - Rank"
        const parts = displayName.split(" - ");
        if (parts.length < 2) continue;

        const rank = parts[1].trim();

        ADMINS[dbid] = rank;
    }

    return ADMINS;
}
