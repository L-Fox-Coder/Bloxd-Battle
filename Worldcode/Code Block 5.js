// =====================================
// MATH HELPERS
// =====================================

function smoothCurve(t) {

    return (
        t * t * t *
        (t * (t * 6 - 15) + 10)
    );
}

function mix(a, b, t) {

    return a + (b - a) * t;
}


// =====================================
// GRADIENT NOISE
// =====================================

function gradient(ix, iz, seed) {

    const rand =
        Math.sin(
            ix * 127.1 +
            iz * 311.7 +
            seed * 918.21
        ) * 43758.5453;

    const angle =
        (rand - Math.floor(rand)) *
        Math.PI * 2;

    return [
        Math.cos(angle),
        Math.sin(angle)
    ];
}

function dot(ix, iz, x, z, seed) {

    const grad =
        gradient(ix, iz, seed);

    return (
        (x - ix) * grad[0] +
        (z - iz) * grad[1]
    );
}


// =====================================
// PERLIN NOISE
// =====================================

function noise(x, z, seed) {

    const x0 = Math.floor(x);
    const x1 = x0 + 1;

    const z0 = Math.floor(z);
    const z1 = z0 + 1;

    const blendX =
        smoothCurve(x - x0);

    const blendZ =
        smoothCurve(z - z0);

    const val0 =
        dot(x0, z0, x, z, seed);

    const val1 =
        dot(x1, z0, x, z, seed);

    const interp0 =
        mix(val0, val1, blendX);

    const val2 =
        dot(x0, z1, x, z, seed);

    const val3 =
        dot(x1, z1, x, z, seed);

    const interp1 =
        mix(val2, val3, blendX);

    return mix(
        interp0,
        interp1,
        blendZ
    );
}


// =====================================
// TERRAIN SHAPE
// =====================================

function terrain(x, z, seed) {

    let value = 0;

    value +=
        noise(
            x * 0.008,
            z * 0.008,
            seed
        ) * 24;

    value +=
        noise(
            x * 0.02,
            z * 0.02,
            seed + 1000
        ) * 10;

    value +=
        noise(
            x * 0.06,
            z * 0.06,
            seed + 2000
        ) * 3;

    return value;
}


// =====================================
// BIOME
// =====================================

function biome(x, z, seed, radius) {

    const mainScale =
        0.02 / (radius / 25);

    const detailScale =
        mainScale * 2.5;

    let value = 0;

    value +=
        noise(
            x * mainScale,
            z * mainScale,
            seed + 5000
        ) * 1;

    value +=
        noise(
            x * detailScale,
            z * detailScale,
            seed + 6000
        ) * 0.2;

    value *= 0.75;

    return value;
}


// =====================================
// START GENERATION
// =====================================

function generateTerrain(
    centerX,
    bottomY,
    centerZ,
    radius,
    baseHeight
) {

    terrainJobs = [];

    terrainBlockCount = 0;
    undergroundBlockCount = 0;

    terrainStartTime = api.now();

    terrainCenterX = centerX;
    terrainCenterZ = centerZ;

    terrainBottomY = bottomY;
    terrainRadius = radius;
    terrainBaseHeight = baseHeight;

    terrainSeed =
        Math.floor(
            Math.random() * 999999
        );

    api.log("================================");
    api.log("STARTING TERRAIN GENERATION");
    api.log("Seed: " + terrainSeed);
    api.log("================================");

    for (
        let chunkX = -radius;
        chunkX <= radius;
        chunkX += terrainChunkSize
    ) {

        for (
            let chunkZ = -radius;
            chunkZ <= radius;
            chunkZ += terrainChunkSize
        ) {

            terrainJobs.push({

                chunkX,
                chunkZ
            });
        }
    }

    totalTerrainJobs =
        terrainJobs.length;

    completedTerrainJobs = 0;

    terrainGenerating = true;

    api.log(
        "Chunks queued: " +
        totalTerrainJobs
    );
}


// =====================================
// GENERATE SURFACE CHUNK
// =====================================

function generateChunk(job) {

    const chunkX = job.chunkX;
    const chunkZ = job.chunkZ;

    for (
        let localX = 0;
        localX < terrainChunkSize;
        localX++
    ) {

        for (
            let localZ = 0;
            localZ < terrainChunkSize;
            localZ++
        ) {

            const worldX =
                terrainCenterX +
                chunkX +
                localX;

            const worldZ =
                terrainCenterZ +
                chunkZ +
                localZ;

            // HEIGHT

            let height = Math.floor(

                terrainBaseHeight +

                terrain(
                    worldX,
                    worldZ,
                    terrainSeed
                )
            );

            if (height < 4) {
                height = 4;
            }

            const topY =
                terrainBottomY + height;

            // BIOME

            const biomeValue =
                biome(
                    worldX,
                    worldZ,
                    terrainSeed,
                    terrainRadius
                );

            let topBlock =
                "Grass Block";

            let underBlock =
                "Dirt";

            if (biomeValue > 0.18) {

                topBlock = "Snow";
                underBlock = "Stone";
            }

            else if (biomeValue < -0.12) {

                topBlock = "Sand";
                underBlock = "Sandstone";
            }

            // TOP BLOCK

            api.setBlock(
                worldX,
                topY,
                worldZ,
                topBlock
            );

            terrainBlockCount++;

            // UNDER LAYER

            api.setBlockRect(

                [
                    worldX,
                    topY - 3,
                    worldZ
                ],

                [
                    worldX,
                    topY - 1,
                    worldZ
                ],

                underBlock
            );

            terrainBlockCount += 3;
        }
    }

    completedTerrainJobs++;

    const percent = Math.floor(

        (completedTerrainJobs /
            totalTerrainJobs) * 100
    );

    api.log(
        "[SURFACE] " +
        percent +
        "%"
    );

    // FINISHED

    if (
        completedTerrainJobs >=
        totalTerrainJobs
    ) {

        terrainGenerating = false;

        api.log(
            "SURFACE COMPLETE"
        );

        startUndergroundGeneration();
    }
}


// =====================================
// START UNDERGROUND
// =====================================

function startUndergroundGeneration() {

    undergroundCurrentX =
        -terrainRadius;

    undergroundCurrentZ =
        -terrainRadius;

    undergroundGenerating = true;

    api.log(
        "STARTING UNDERGROUND..."
    );
}


// =====================================
// GENERATE UNDERGROUND CHUNK
// =====================================

function generateUndergroundChunk() {

    const startX =
        terrainCenterX +
        undergroundCurrentX;

    const startZ =
        terrainCenterZ +
        undergroundCurrentZ;

    for (
        let localX = 0;
        localX < terrainChunkSize;
        localX++
    ) {

        for (
            let localZ = 0;
            localZ < terrainChunkSize;
            localZ++
        ) {

            const worldX =
                startX + localX;

            const worldZ =
                startZ + localZ;

            // HEIGHT

            let height = Math.floor(

                terrainBaseHeight +

                terrain(
                    worldX,
                    worldZ,
                    terrainSeed
                )
            );

            if (height < 4) {
                height = 4;
            }

            const topY =
                terrainBottomY + height;

            // BEDROCK

            api.setBlock(
                worldX,
                terrainBottomY,
                worldZ,
                "Bedrock"
            );

            undergroundBlockCount++;

            // STONE

            if (
                topY - 4 >
                terrainBottomY + 1
            ) {

                api.setBlockRect(

                    [
                        worldX,
                        terrainBottomY + 1,
                        worldZ
                    ],

                    [
                        worldX,
                        topY - 4,
                        worldZ
                    ],

                    "Stone"
                );

                undergroundBlockCount +=

                    (topY - 4) -
                    (terrainBottomY + 1) + 1;
            }
        }
    }

    // NEXT CHUNK

    undergroundCurrentZ +=
        terrainChunkSize;

    if (

        undergroundCurrentZ >

        terrainRadius +
        terrainChunkSize - 1
    ) {

        undergroundCurrentZ =
            -terrainRadius;

        undergroundCurrentX +=
            terrainChunkSize;
    }

    // FINISHED

    if (

        undergroundCurrentX >

        terrainRadius +
        terrainChunkSize - 1
    ) {

        undergroundGenerating = false;

        startStructureGeneration();

        const endTime =
            api.now();

        const totalTime =
            (
                (endTime -
                    terrainStartTime) /
                1000
            ).toFixed(2);

        api.log("================================");
        api.log("WORLD GENERATION COMPLETE");
        api.log("================================");

        api.log(
            "Time: " +
            totalTime +
            "s"
        );

        api.log(
            "Surface Blocks: " +
            terrainBlockCount
        );

        api.log(
            "Underground Blocks: " +
            undergroundBlockCount
        );

        api.log(
            "Total Blocks: " +
            (
                terrainBlockCount +
                undergroundBlockCount
            )
        );

        api.log("================================");
    }
}


// =====================================
// MAIN TICK
// =====================================

function terrainTick() {

    terrainDelay++;

    if (terrainDelay < 3) {
        return;
    }

    terrainDelay = 0;

    // SURFACE

    if (
        terrainGenerating &&
        terrainJobs.length > 0
    ) {

        generateChunk(
            terrainJobs.shift()
        );

        return;
    }

    // UNDERGROUND

    if (undergroundGenerating) {

        generateUndergroundChunk();

        return;
    }

    if (structureGenerating) {

        structureTick();
    }
}


// STRUCTURES

function getTerrainHeight(x, z) {

    let height = Math.floor(
        terrainBaseHeight +
        terrain(x, z, terrainSeed)
    );

    if (height < 4) {
        height = 4;
    }

    return terrainBottomY + height;
}

function findStructureLocation(structure) {

    for (let attempt = 0; attempt < 100; attempt++) {

        const worldX =
            terrainCenterX +
            Math.floor(Math.random() * terrainRadius * 2) -
            terrainRadius;

        const worldZ =
            terrainCenterZ +
            Math.floor(Math.random() * terrainRadius * 2) -
            terrainRadius;

        const targetY = getTerrainHeight(worldX, worldZ);

        // Reject very steep terrain
        const variant =
            structure.variants[
            Math.floor(Math.random() * structure.variants.length)
            ];

        const minX = variant.min[0] - variant.anchor[0];
        const maxX = variant.max[0] - variant.anchor[0];

        const minZ = variant.min[2] - variant.anchor[2];
        const maxZ = variant.max[2] - variant.anchor[2];

        const radius = Math.max(
            Math.abs(minX),
            Math.abs(maxX),
            Math.abs(minZ),
            Math.abs(maxZ)
        );

        let minHeight = 9999;
        let maxHeight = -9999;

        for (let x = -radius; x <= radius; x += 2) {
            for (let z = -radius; z <= radius; z += 2) {

                const h = getTerrainHeight(
                    worldX + x,
                    worldZ + z
                );

                if (h < minHeight) minHeight = h;
                if (h > maxHeight) maxHeight = h;
            }
        }

        if (maxHeight - minHeight > 2) {
            continue;
        }

        let valid = true;

        for (const pos of structurePositions) {

            const dx = worldX - pos.x;
            const dz = worldZ - pos.z;

            if (Math.sqrt(dx * dx + dz * dz) < Math.max(structure.spacing, pos.spacing)) {
                valid = false;
                break;
            }
        }

        if (!valid) continue;

        structurePositions.push({
            x: worldX,
            z: worldZ,
            spacing: structure.spacing
        });

        structureQueue.push({
    structure: structure,
    variant: location.variant,
    worldX: location.x,
    worldY: location.y,
    worldZ: location.z
});
    }

    return null;
}

function startStructureGeneration() {

    structurePositions = [];
    placedStructures = 0;
    structureQueue = [];

    const count = Math.max(
        3,
        Math.floor(terrainRadius / 10)
    );

    for (let i = 0; i < count; i++) {

        const structure =
            structures[
            Math.floor(
                Math.random() *
                structures.length
            )
            ];

        const location =
            findStructureLocation(structure);

        if (!location) {
            continue;
        }

        return {
            x: worldX,
            y: targetY,
            z: worldZ,
            variant: variant
        };
    }

    structureGenerating = true;

    api.log(
        "Queued " +
        structureQueue.length +
        " structures"
    );
}

function placeStructure(job) {

    const structure = job.structure;
    const variant = job.variant;

    const offsetX = job.worldX - variant.anchor[0];
    const offsetY = job.worldY - variant.anchor[1];
    const offsetZ = job.worldZ - variant.anchor[2];

    for (let x = variant.min[0]; x <= variant.max[0]; x++) {

        for (let y = variant.min[1]; y <= variant.max[1]; y++) {

            for (let z = variant.min[2]; z <= variant.max[2]; z++) {

                const block = api.getBlock(x, y, z);

                if (block === "Air") continue;

                api.setBlock(
                    x + offsetX,
                    y + offsetY,
                    z + offsetZ,
                    block
                );
            }
        }
    }

    placedStructures++;

    api.log("Placed: " + structure.name);
}

function structureTick() {

    if (
        !structureGenerating
    ) {
        return;
    }

    structureDelay++;

    if (
        structureDelay < 3
    ) {
        return;
    }

    structureDelay = 0;

    if (
        structureQueue.length <= 0
    ) {

        structureGenerating = false;

        api.log(
            "STRUCTURES COMPLETE"
        );

        api.log(
            "Placed: " +
            placedStructures
        );

        return;
    }

    placeStructure(
        structureQueue.shift()
    );
}

