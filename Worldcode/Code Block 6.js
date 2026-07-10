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

                min: [17, 17, 11],
                max: [23, 20, 7]
            },

            {
                anchor: [20, 22, 9],

                min: [18, 23, 6],
                max: [22, 26, 12]
            },

            {
                anchor: [20, 28, 9],

                min: [17, 29, 11],
                max: [23, 32, 7]
            }

        ]

        // Optional future settings:
        // biome:["Forest","Plains"],
        // maxSlope:3
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

StructureEngine.log = function(message) {

    if (!StructureEngine.debug) return;

    api.log("[STRUCTURES] " + message);

};

//==================================================
// BOUNDING BOX CHECK
//==================================================

StructureEngine.canPlaceAt = function(minX, maxX, minZ, maxZ, spacing) {

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

StructureEngine.addPlaced = function(

    minX,
    maxX,
    minZ,
    maxZ,
    spacing,
    name

){

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

StructureEngine.pickStructure = function() {

    let totalWeight = 0;

    for (const structure of structures) {

        totalWeight += structure.weight;

    }

    let value = Math.random() * totalWeight;

    for (const structure of structures) {

        value -= structure.weight;

        if (value <= 0) {

            return structure;

        }

    }

    return structures[0];

};


//==================================================
// PICK RANDOM VARIANT
//==================================================

StructureEngine.pickVariant = function(structure) {

    return structure.variants[

        StructureEngine.randomInt(

            0,

            structure.variants.length - 1

        )

    ];

};


//==================================================
// SPACING CHECK
//==================================================

StructureEngine.canPlaceAt = function(x, z, spacing) {

    for (const placed of StructureEngine.placed) {

        const required = Math.max(

            spacing,

            placed.spacing

        );

        if (

            StructureEngine.distanceSquared(

                x,

                z,

                placed.x,

                placed.z

            )

            <

            required * required

        ) {

            return false;

        }

    }

    return true;

};


//==================================================
// QUEUE
//==================================================

StructureEngine.queueStructure = function(job) {

    StructureEngine.queue.push(job);

    StructureEngine.stats.queued++;

};


//==================================================
// START
//==================================================

StructureEngine.start = function() {

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

};


//==================================================
// STOP
//==================================================

StructureEngine.stop = function() {

    StructureEngine.generating = false;

    StructureEngine.log("Finished");

};

//==================================================
// START GENERATION
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

    StructureEngine.log("Finding structure locations...");

    StructureEngine.buildQueue();

};


//==================================================
// BUILD QUEUE
//==================================================

StructureEngine.buildQueue = function () {

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

            z: location.z,

            y: location.y,

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

        "Queued "

        + StructureEngine.stats.queued

        + " structures."

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

    return null;

};

//==================================================
// FLATTEN TERRAIN
//==================================================

StructureEngine.flattenArea = function(job){

    const targetY = job.y;

    for(let x=job.minX;x<=job.maxX;x++){

        for(let z=job.minZ;z<=job.maxZ;z++){

            const currentY =
                getTerrainHeight(x,z);

            // remove hills

            if(currentY>targetY){

                api.setBlockRect(

                    [x,targetY+1,z],

                    [x,currentY,z],

                    "Air"

                );

            }

            // fill valleys

            if(currentY<targetY){

                api.setBlockRect(

                    [x,currentY+1,z],

                    [x,targetY,z],

                    "Dirt"

                );

            }

            api.setBlock(

                x,

                targetY,

                z,

                "Grass Block"

            );

        }

    }

};


//==================================================
// PLACE STRUCTURE
//==================================================

StructureEngine.placeStructure=function(job){

    const variant=job.variant;

    const offsetX=

        job.x-

        variant.anchor[0];

    const offsetY=

        job.y-

        variant.anchor[1];

    const offsetZ=

        job.z-

        variant.anchor[2];

    StructureEngine.flattenArea(job);

    for(

        let x=variant.min[0];

        x<=variant.max[0];

        x++

    ){

        for(

            let y=variant.min[1];

            y<=variant.max[1];

            y++

        ){

            for(

                let z=variant.min[2];

                z<=variant.max[2];

                z++

            ){

                if(api.isNearInterrupt()){

                    return false;

                }

                const block=

                    api.getBlock(

                        x,

                        y,

                        z

                    );

                if(block==="Air"){

                    continue;

                }

                const worldX=

                    offsetX+x;

                const worldY=

                    offsetY+y;

                const worldZ=

                    offsetZ+z;

                api.setBlock(

                    worldX,

                    worldY,

                    worldZ,

                    block

                );

                // fill underneath

                api.setBlockRect(

                    [

                        worldX,

                        terrainBottomY+1,

                        worldZ

                    ],

                    [

                        worldX,

                        worldY-1,

                        worldZ

                    ],

                    "Stone"

                );

            }

        }

    }

    StructureEngine.stats.placed++;

    return true;

};


//==================================================
// TICK
//==================================================

StructureEngine.tick=function(){

    if(

        !StructureEngine.generating

    ){

        return;

    }

    StructureEngine.delayCounter++;

    if(

        StructureEngine.delayCounter

        <

        StructureEngine.delay

    ){

        return;

    }

    StructureEngine.delayCounter=0;

    if(

        StructureEngine.queue.length<=0

    ){

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

    const job=

        StructureEngine.queue[0];

    if(

        StructureEngine.placeStructure(job)

    ){

        StructureEngine.queue.shift();

    }

};
