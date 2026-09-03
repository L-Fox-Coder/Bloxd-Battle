var treeQueue = [];
var treeGenerating = false;
var treeDelay = 0;

var treeStats = {

    queued: 0,
    placed: 0

};

function startTreeGeneration() {

    treeQueue = [];

    treeStats = {

        queued: 0,
        placed: 0

    };

    const area = Math.PI * terrainRadius * terrainRadius;

    // 1 tree every ~450 blocks
    const treeCount = Math.floor(area / 450);

    for (let i = 0; i < treeCount; i++) {

        const worldX =
            terrainCenterX +
            Math.floor(Math.random() * terrainRadius * 2) -
            terrainRadius;

        const worldZ =
            terrainCenterZ +
            Math.floor(Math.random() * terrainRadius * 2) -
            terrainRadius;

        const worldY =
            getTerrainHeight(worldX, worldZ);

        const blocks =
            getTerrainBlocks(worldX, worldZ);

        // Only spawn on grass
        if (blocks.top !== "Grass Block") {
            continue;
        }

        // Random chance
        if (Math.random() > 0.30) {
            continue;
        }

        treeQueue.push({

            x: worldX,
            y: worldY,
            z: worldZ

        });

    }

    treeStats.queued = treeQueue.length;

    treeGenerating = true;

    api.log(
        "Queued " +
        treeQueue.length +
        " trees."
    );


}

function treeTick() {

    if (!treeGenerating) {
        return;
    }

    treeDelay++;

    if (treeDelay < 2) {
        return;
    }

    treeDelay = 0;

    if (treeQueue.length <= 0) {

        treeGenerating = false;

        api.log(
            "Placed " +
            treeStats.placed +
            " trees."
        );

        // Continue world generation
        StructureEngine.start();

        return;
    }

    if (api.isNearInterrupt()) {
        return;
    }

    const tree =
        treeQueue.shift();

    api.setBlock(
        tree.x,
        tree.y + 1,
        tree.z,
        "Maple Sapling"
    );

    api.setBlockData(

        tree.x,
        tree.y + 1,
        tree.z,

        {

            growTime: api.now()

        }

    );

    treeStats.placed++;

}
