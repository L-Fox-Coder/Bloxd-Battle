//==================================================
// STRUCTURE ENGINE V2 - PART 1
//==================================================

//==================================================
// STRUCTURE LIST
//==================================================

var structures = [

    {
        name: "Tent",

        weight: 10,

        spacing: 40,

        variants: [

            {
                anchor: [20, 10, 9],

                min: [18, 11, 6],
                max: [22, 14, 12]
            },

            {
                anchor: [20, 16, 9],

                min: [17, 17, 7],
                max: [23, 20, 11]
            },

            {
                anchor: [20, 22, 9],

                min: [18, 23, 6],
                max: [22, 26, 12]
            },

            {
                anchor: [20, 28, 9],

                min: [17, 29, 7],
                max: [23, 32, 11]
            }

        ]
    },

    {
        name: "Cornucopia",

        weight: 1,

        spacing: 40,

        variants: [
            {
                anchor: [192, 40, -35],

                min: [167, 39, -60],
                max: [216, 127, -9]
            }
        ],

        forcedLocations: [
            [0, 0]
        ]
    }

];


//==================================================
// ENGINE
//==================================================

globalThis.StructureEngine = {};

StructureEngine.debug = true;

StructureEngine.generating = false;

StructureEngine.delay = 3;

StructureEngine.delayCounter = 0;

StructureEngine.queue = [];


//==================================================
// DEBUG
//==================================================

StructureEngine.log = function (message) {

    if (!StructureEngine.debug) return;

    api.log("[STRUCTURES] " + message);

};

StructureEngine.randomInt = function (min, max) {

    return Math.floor(

        Math.random() *

        (max - min + 1)

    ) + min;

};

//==================================================
// BOUNDING BOX CHECK
//==================================================

StructureEngine.canPlaceAt = function (minX, maxX, minZ, maxZ, spacing) {

    for (const placed of StructureEngine.placed) {

        if (

            maxX + spacing < placed.minX ||
            minX - spacing > placed.maxX ||

            maxZ + spacing < placed.minZ ||
            minZ - spacing > placed.maxZ

        ) {

            continue;
        }

        return false;
    }

    return true;

};

StructureEngine.stats = {

    queued: 0,

    placed: 0,

    failed: 0

};

//==================================================
// STORE PLACED STRUCTURE
//==================================================

StructureEngine.addPlaced = function (

    minX,
    maxX,
    minZ,
    maxZ,
    spacing,
    name

) {

    StructureEngine.placed.push({

        minX,
        maxX,

        minZ,
        maxZ,

        spacing,

        name

    });

};

//==================================================
// PICK RANDOM STRUCTURE
//==================================================

StructureEngine.pickStructure = function (forcedOnly = false) {

    // Structures available for normal random spawning
    const availableStructures = structures.filter(structure => {

        // If this structure has forced locations,
        // don't let it spawn randomly elsewhere
        if (
            structure.forcedLocations &&
            structure.forcedLocations.length > 0
        ) {
            return false;
        }

        return true;
    });

    // If there are no available structures
    if (availableStructures.length === 0) {
        return null;
    }

    let totalWeight = 0;

    for (const structure of availableStructures) {
        totalWeight += structure.weight;
    }

    let value = Math.random() * totalWeight;

    for (const structure of availableStructures) {

        value -= structure.weight;

        if (value <= 0) {
            return structure;
        }
    }

    return availableStructures[0];
};


//==================================================
// PICK RANDOM VARIANT
//==================================================

StructureEngine.pickVariant = function (structure) {

    return structure.variants[

        StructureEngine.randomInt(

            0,

            structure.variants.length - 1

        )

    ];

};

//==================================================
// QUEUE
//==================================================

StructureEngine.queueStructure = function (job) {

    StructureEngine.queue.push(job);

    StructureEngine.stats.queued++;

};


//==================================================
// START
//==================================================

StructureEngine.start = function () {

    StructureEngine.generating = true;

    StructureEngine.delayCounter = 0;

    StructureEngine.queue = [];

    StructureEngine.placed = [];

    StructureEngine.stats = {

        queued: 0,

        placed: 0,

        failed: 0

    };

    StructureEngine.log("Started");

    StructureEngine.buildQueue();

};


//==================================================
// STOP
//==================================================

StructureEngine.stop = function () {

    StructureEngine.generating = false;

    StructureEngine.log("Finished");

    StructureEngine.log("Generating Loot Chests...");

    for (let i = 0; i < CratePosC.length; i++) {

        spawnCrateItems(CratePosC[i], crateEmptyC, crateMinC, crateMaxC, crateItemsC);
    }

    for (let i = 0; i < CratePosU.length; i++) {

        spawnCrateItems(CratePosU[i], crateEmptyU, crateMinU, crateMaxU, crateItemsU);
    }

    for (let i = 0; i < CratePosR.length; i++) {

        spawnCrateItems(CratePosR[i], crateEmptyR, crateMinR, crateMaxR, crateItemsR);
    }

    for (let i = 0; i < CratePosE.length; i++) {

        spawnCrateItems(CratePosE[i], crateEmptyE, crateMinE, crateMaxE, crateItemsE);
    }

    for (let i = 0; i < CratePosL.length; i++) {

        spawnCrateItems(CratePosL[i], crateEmptyL, crateMinL, crateMaxL, crateItemsL);
    }

    for (let i = 0; i < CratePosM.length; i++) {

        spawnCrateItems(CratePosM[i], crateEmptyM, crateMinM, crateMaxM, crateItemsM);
    }

    StructureEngine.log("Loot Chest Generation Finished");
};

//==================================================
// BUILD QUEUE
//==================================================

StructureEngine.buildQueue = function () {

    // ==========================================
    // FORCED STRUCTURES
    // ==========================================

    for (const structure of structures) {

        if (!structure.forcedLocations) continue;

        for (const forced of structure.forcedLocations) {

            // forced = [X offset, Z offset]
            const forcedX = forced[0];
            const forcedZ = forced[1];

            const variant = structure.variants[0];

            const x =
                terrainCenterX + forcedX;

            const z =
                terrainCenterZ + forcedZ;

            // Use the terrain height just like normal structures
            const y =
                getTerrainHeight(x, z);

            // Calculate structure bounds relative to anchor
            const minX =
                x + variant.min[0] - variant.anchor[0];

            const maxX =
                x + variant.max[0] - variant.anchor[0];

            const minZ =
                z + variant.min[2] - variant.anchor[2];

            const maxZ =
                z + variant.max[2] - variant.anchor[2];

            // Queue structure
            StructureEngine.queue.push({

                structure,
                variant,

                x,
                y,
                z,

                minX,
                maxX,

                minZ,
                maxZ
            });

            // Mark area as occupied
            StructureEngine.addPlaced(

                minX,
                maxX,

                minZ,
                maxZ,

                structure.spacing,

                structure.name
            );

            StructureEngine.stats.queued++;

            StructureEngine.log(
                "Forced " +
                structure.name +
                " at " +
                x + ", " +
                y + ", " +
                z
            );
        }
    }


    // ==========================================
    // RANDOM STRUCTURES
    // ==========================================

    const targetCount = Math.max(
        3,
        Math.floor(terrainRadius / 10)
    );

    for (let i = 0; i < targetCount; i++) {

        const structure =
            StructureEngine.pickStructure();

        const variant =
            StructureEngine.pickVariant(structure);

        const location =
            StructureEngine.findLocation(
                structure,
                variant
            );

        if (!location) {

            StructureEngine.stats.failed++;

            continue;
        }

        StructureEngine.queue.push({

            structure,
            variant,

            x: location.x,
            y: location.y,
            z: location.z,

            minX: location.minX,
            maxX: location.maxX,

            minZ: location.minZ,
            maxZ: location.maxZ
        });

        StructureEngine.addPlaced(

            location.minX,
            location.maxX,

            location.minZ,
            location.maxZ,

            structure.spacing,
            structure.name
        );

        StructureEngine.stats.queued++;
    }


    StructureEngine.log(
        "Queued " +
        StructureEngine.stats.queued +
        " structures."
    );
};


//==================================================
// FIND LOCATION
//==================================================

StructureEngine.findLocation = function (

    structure,

    variant

) {

    const localMinX =

        variant.min[0] -

        variant.anchor[0];

    const localMaxX =

        variant.max[0] -

        variant.anchor[0];

    const localMinZ =

        variant.min[2] -

        variant.anchor[2];

    const localMaxZ =

        variant.max[2] -

        variant.anchor[2];

    for (

        let attempt = 0;

        attempt < 100;

        attempt++

    ) {

        const worldX =

            terrainCenterX +

            StructureEngine.randomInt(

                -terrainRadius,

                terrainRadius

            );

        const worldZ =

            terrainCenterZ +

            StructureEngine.randomInt(

                -terrainRadius,

                terrainRadius

            );

        const minX =

            worldX + localMinX;

        const maxX =

            worldX + localMaxX;

        const minZ =

            worldZ + localMinZ;

        const maxZ =

            worldZ + localMaxZ;

        if (

            minX < terrainCenterX - terrainRadius ||

            maxX > terrainCenterX + terrainRadius ||

            minZ < terrainCenterZ - terrainRadius ||

            maxZ > terrainCenterZ + terrainRadius

        ) {

            continue;

        }

        if (

            !StructureEngine.canPlaceAt(

                minX,

                maxX,

                minZ,

                maxZ,

                structure.spacing

            )

        ) {

            continue;

        }

        const y =

            getTerrainHeight(

                worldX,

                worldZ

            );

        return {

            x: worldX,

            y,

            z: worldZ,

            minX,
            maxX,

            minZ,
            maxZ

        };

    }

    api.log("Failed to find location for " + structure.name);

    return null;

};

//==================================================
// PLACE STRUCTURE
//==================================================

StructureEngine.placeStructure = function (job) {

    const variant = job.variant;

    const offsetX = job.x - variant.anchor[0];
    const offsetY = job.y - variant.anchor[1];
    const offsetZ = job.z - variant.anchor[2];

    // Track the lowest solid block in each X/Z column
    const columns = {};

    // ==========================
    // FIRST PASS
    // ==========================

    for (let x = variant.min[0]; x <= variant.max[0]; x++) {

        for (let y = variant.min[1]; y <= variant.max[1]; y++) {

            for (let z = variant.min[2]; z <= variant.max[2]; z++) {

                if (api.isNearInterrupt()) {
                    return false;
                }

                const block = api.getBlock(x, y, z);

                if (block === "Air") {
                    continue;
                }

                const worldX = offsetX + x;
                const worldY = offsetY + y;
                const worldZ = offsetZ + z;

                const key = worldX + "," + worldZ;

                if (
                    columns[key] === undefined ||
                    worldY < columns[key]
                ) {
                    columns[key] = worldY;
                }
            }
        }
    }

    // ==========================
    // FLATTEN / FILL
    // ==========================

    // World Y of the structure's bottom layer
    const baseY = offsetY + variant.min[1];

    for (const key in columns) {

        const parts = key.split(",");

        const worldX = Number(parts[0]);
        const worldZ = Number(parts[1]);

        const currentY = getTerrainHeight(worldX, worldZ);

        const blocks = getTerrainBlocks(worldX, worldZ);

        // Remove terrain above the structure base
        if (currentY > baseY - 1) {

            api.setBlockRect(

                [worldX, baseY, worldZ],

                [worldX, currentY, worldZ],

                "Air"

            );

        }

        // Fill terrain up to the structure base
        if (currentY < baseY - 1) {

            api.setBlockRect(

                [worldX, currentY + 1, worldZ],

                [worldX, baseY - 1, worldZ],

                blocks.under

            );

        }

        // Top surface block
        api.setBlock(

            worldX,

            baseY - 1,

            worldZ,

            blocks.top

        );

    }

    // ==========================
    // PLACE STRUCTURE
    // ==========================

    for (let x = variant.min[0]; x <= variant.max[0]; x++) {

        for (let y = variant.min[1]; y <= variant.max[1]; y++) {

            for (let z = variant.min[2]; z <= variant.max[2]; z++) {

                if (api.isNearInterrupt()) {
                    return false;
                }

                const block = api.getBlock(x, y, z);

                if (block === "Air") {
                    continue;
                }

                const worldX = offsetX + x;
                const worldY = offsetY + y;
                const worldZ = offsetZ + z;

                api.setBlock(
                    worldX,
                    worldY,
                    worldZ,
                    block
                );

                if (block === "Coconut Block") CratePosC.push([worldX, worldY, worldZ]);
                if (block === "Pear Block") CratePosU.push([worldX, worldY, worldZ]);
                if (block === "Cherry Block") CratePosR.push([worldX, worldY, worldZ]);
                if (block === "Plum Block") CratePosE.push([worldX, worldY, worldZ]);
                if (block === "Banana Block") CratePosL.push([worldX, worldY, worldZ]);
                if (block === "Apple Block") CratePosM.push([worldX, worldY, worldZ]);
            }
        }
    }

    StructureEngine.stats.placed++;

    return true;
};


//==================================================
// TICK
//==================================================

StructureEngine.tick = function () {

    if (

        !StructureEngine.generating

    ) {

        return;

    }

    StructureEngine.delayCounter++;

    if (

        StructureEngine.delayCounter

        <

        StructureEngine.delay

    ) {

        return;

    }

    StructureEngine.delayCounter = 0;

    if (

        StructureEngine.queue.length <= 0

    ) {

        StructureEngine.stop();

        StructureEngine.log(

            "Placed "

            +

            StructureEngine.stats.placed

            +

            " structures."

        );

        return;

    }

    const job =

        StructureEngine.queue[0];

    if (

        StructureEngine.placeStructure(job)

    ) {

        StructureEngine.queue.shift();

    }

};
