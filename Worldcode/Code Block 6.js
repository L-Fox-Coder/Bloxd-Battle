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
