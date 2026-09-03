const ORES = [

    {
        block: "Coal Ore",

        veins: 200,

        minY: 10,
        maxY: 90,

        minLength: 3,
        maxLength: 7,
    },

    {
        block: "Iron Ore",

        veins: 130,

        minY: 8,
        maxY: 60,

        minLength: 1,
        maxLength: 5,
    },

    {
        block: "Gold Ore",

        veins: 90,

        minY: 5,
        maxY: 35,

        minLength: 2,
        maxLength: 6,
    },

    {
        block: "Diamond Ore",

        veins: 50,

        minY: 1,
        maxY: 18,

        minLength: 2,
        maxLength: 4,
    }

];

function generateVein(origin, minLength, maxLength, oreType) {

    var lastPos = origin;
    var nextPos = [];
    var length;

    api.setBlock(origin, oreType);

    length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

    for (let i = 0; i < length; i++) {
        var dir = Math.floor(Math.random() * 6);
        switch (dir) {
            case 0:
                nextPos = [lastPos[0] + 1, lastPos[1], lastPos[2]];
                break;
            case 1:
                nextPos = [lastPos[0] - 1, lastPos[1], lastPos[2]];
                break;
            case 2:
                nextPos = [lastPos[0], lastPos[1] + 1, lastPos[2]];
                break;
            case 3:
                nextPos = [lastPos[0], lastPos[1] - 1, lastPos[2]];
                break;
            case 4:
                nextPos = [lastPos[0], lastPos[1], lastPos[2] + 1];
                break;
            case 5:
                nextPos = [lastPos[0], lastPos[1], lastPos[2] - 1];
                break;

        }

        if (api.getBlock(nextPos) === "Stone") {
            api.setBlock(nextPos, oreType);
        }
        lastPos = nextPos;
    }

}


function generateOres(terrainMin, terrainMax, terrainBottom) {

    for (let i = 0; i < ORES.length; i++) {

        for (let vein = 0; vein < ORES[i].veins; vein++) {

            var randomX = Math.floor(Math.random() * (terrainMax[0] - terrainMin[0] + 1)) + terrainMin[0];
            var randomY = (Math.floor(Math.random() * (ORES[i].maxY - ORES[i].minY + 1)) + ORES[i].minY) + terrainBottom;
            var randomZ = Math.floor(Math.random() * (terrainMax[1] - terrainMin[1] + 1)) + terrainMin[1];

            var randomPos = [randomX, randomY, randomZ];

            generateVein(randomPos, ORES[i].minLength, ORES[i].maxLength, ORES[i].block);
        }

    }

    startTreeGeneration();

}
