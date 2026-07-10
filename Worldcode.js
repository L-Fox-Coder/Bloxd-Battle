var npc_coords = {
    solo: [18, 2, 2]
};

function onPlayerClick(id, alt, x, y, z, block, Tid) {

    // Extract coords for easier reading
    var target = npc_coords.solo;

    // Compare each individual coordinate
    var matchFoot = (x === target[0] && y === target[1] && z === target[2]);
    var matchHead = (x === target[0] && y === (target[1] + 1) && z === target[2]);

    if (matchFoot || matchHead) {
        Queue(id, "Solo");
    }
}

function Queue(id, gamemode) {
    api.sendMessage(id, "Queued " + gamemode)
}

function loadCode(x, y, z) {

    if (api.isBlockInLoadedChunk(x, y, z)) {

        globalThis.code = api.getBlockData(x, y, z)?.persisted?.shared?.text ?? "";

    } else {
        return false;
    }


    api.log("Loading Code Block At: " + x + ", " + y + ", " + z);

    try {
        globalThis.eval(code);
        api.log("SUCCESS");
        return true;
    }
    catch (err) {
        api.log("FAILED:");
        api.log(err);
        return false;
    }

}

var playerStats = {};
var visualState = {};
let counter = 0;
let wasDead = {}; // adjust if needed
var VOID_Y_LEVEL = -100;
var codeLoaded = false;
var infernoRings = [];

var terrainGenerating = false;
var undergroundGenerating = false;
var terrainDelay = 1;
var undergroundDelay = 1;
var terrainSeed = 0;
var terrainCenterX = 0;
var terrainCenterZ = 0;
var terrainBottomY = 0;
var terrainRadius = 0;
var terrainBaseHeight = 0;
var terrainChunkSize = 8;
var terrainCurrentChunkX = 0;
var terrainCurrentChunkZ = 0;
var undergroundCurrentX = 0;
var undergroundCurrentZ = 0;
var totalChunks = 0;
var completedChunks = 0;
var terrainBlockCount = 0;
var undergroundBlockCount = 0;
var terrainStartTime = 0;
var structureGenerating = false;
var structureQueue = [];
var structureDelay = 0;
var structurePositions = [];
var placedStructures = 0;

var structures = [

    {
        name: "Tent",

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
            },
        ]
    }
];

// =====================================
// CLEAR TERRAIN GLOBALS
// =====================================
var clearJobs = [];
var clearingTerrain = false;
var clearDelay = 0;
var totalClearJobs = 0;
var completedClearJobs = 0;
var clearedBlocks = 0;
var clearStartTime = 0;



var CODE = [

    [-1, 1, -2],
    [-1, 1, -3],
    [-1, 1, -4],
    [-1, 1, -5],
    [-1, 1, -6],
    [-1, 1, -7]

];
var codeLoadIndex = 0;

/* ===== CHAT CONFIG ===== */

var ADMINS = {};

var RANK_ORDER = [
    "Novice",
    "Apprentice",
    "Warrior",
    "Champion",
    "Legend",
    "Mythic",
    "Insane",
    "Nightmare",
    "Dreadlord",
    "Abysswalker",
    "Voidborn",
    "Eternal",
    "Godslayer",
    "Cataclysm",
    "Oblivion"
];

var RANK_COLORS = {
    "Novice": "#ffffff",      // Pure white
    "Apprentice": "#6bd4ff",  // Light blue
    "Warrior": "#32cd32",     // Bright green
    "Champion": "#ffb347",    // Heroic orange
    "Legend": "#ff4500",      // Strong red-orange
    "Mythic": "#b86bff",      // Magical purple
    "Insane": "#ff0033",      // Aggressive red
    "Nightmare": "#cc0000",   // Dark blood red
    "Dreadlord": "#990000",   // Deep crimson
    "Abysswalker": "#660066", // Dark cursed purple
    "Voidborn": "#330033",    // Almost black purple
    "Eternal": "#1a001a",     // Shadow violet
    "Godslayer": "#0d0d0d",   // Near black
    "Cataclysm": "#080000",   // Dark abyss red
    "Oblivion": "#000000"     // Pure black
};

const ILLEGAL_ITEMS = [
    "Purple Portal",
    "Splash Milk Potion",
    "Arrow of Milk",
    "Milk Potion"
];

var CUSTOM_ITEMS = [
    "Red Portal",
    "Black Portal"
];

// Role colors
const ROLE_COLORS = {
    "Owner": "#be76f5",        // Light Purple
    "Co-Owner": "#9e3ea3",   // Dark Purple
    Builder: "#33ffaa",      // Pale Green
    Dev: "#3388ff",          // Dark Blue
    Mod: "#ff7777"           // Pale Red
};

// Chat colors
const CHAT_COLORS = {
    adminPrefix: "#ffaa00",
    adminName: "#ff5555",
    playerName: "#ff5555",
    message: "#ffffff"
};

// Check if a player is admin
function isAdmin(dbid) {
    return ADMINS[dbid] !== undefined;

}

function getAdminRole(dbid) {
    return ADMINS[dbid];
}

function getRoleColor(role) {
    return ROLE_COLORS[role];
}

/* ===== CHAT HANDLER ===== */
function onPlayerChat(id, message, channel) {
    const dbid = api.getPlayerDbId(id);
    const displayName = playerStats[id]?.nick || api.getEntityName(id);
    const admin = isAdmin(dbid) && !playerStats[id]?.nick;

    if (playerStats[id].initialised === false) {
        return false;
    }


    if (playerStats[id].muted === true) {
        api.sendMessage(id, "You are muted by an admin!", { color: "red" });
        return false;
    }

    let parts = [];

    if (admin) {
        parts.push({
            str: "[Admin] ",
            style: { color: CHAT_COLORS.adminPrefix }
        });

        const role = getAdminRole(dbid);
        if (role) {
            parts.push({
                str: `[${role}] `,
                style: { color: getRoleColor(role) }
            });
        }
    }

    parts.push({
        str: `${displayName}: `,
        style: { color: admin ? CHAT_COLORS.adminName : CHAT_COLORS.playerName }
    });

    parts.push({
        str: message,
        style: { color: CHAT_COLORS.message }
    });

    /* ===== ADMIN CHANNEL ===== */

    if (channel === "Staff") {

        // Add Staff Chat tag at the very front
        parts.unshift({
            str: "[Staff Chat] ",
            style: { color: "#73e88c" }
        });

        const players = api.getPlayerIds();
        players.forEach(pid => {
            if (isAdmin(api.getPlayerDbId(pid))) {
                api.sendMessage(pid, parts);
            }
        });

        return false; // stop global broadcast
    }
    api.broadcastMessage(parts);
    return false;
}

/* ===== PLAYER COMMANDS ===== */
function playerCommand(id, command) {
    api.log(id);
    const dbid = api.getPlayerDbId(id);

    const parts = command.split(" ");
    api.log(parts);
    const cmd = parts[0];       // command name
    const args = parts.slice(1); // everything after
    api.log(args);

    if (isAdmin(dbid)) {
        if (adminCommands(id, cmd, args) === true) return true;
    } else {
        if (playerCommands(id, cmd, args) === true) return true;
    }
}

function purgeIllegalItems(id) {
    const dbid = api.getPlayerDbId(id);

    // Don't punish admins
    if (isAdmin(dbid)) return;

    const playerName = api.getEntityName(id);

    for (const itemName of ILLEGAL_ITEMS) {

        // Check if player has the item BEFORE removing
        const amount = api.getInventoryItemAmount(id, itemName);

        if (amount > 0) {

            // Remove ALL copies
            api.removeItemName(id, itemName, 999);

            api.sendMessage(id, [{ str: "Your not allowed to have ", style: { color: "red" } }, { str: amount + "x ", style: { color: "slateGray" } }, { str: itemName, style: { color: "lime" } }]);

            api.applyMeleeHit(id, id, [0, 0, 0], null, {
                damage: amount / 9.99,
                heldItemName: itemName
            });

            // Alert all admins
            for (let adminId of api.getPlayerIds()) {
                const adminDbid = api.getPlayerDbId(adminId);

                if (isAdmin(adminDbid)) {
                    api.sendMessage(adminId, [{ str: "[ILLEGAL ITEM] ", style: { color: "red" } }, { str: playerName, style: { color: "orange" } }, { str: " had ", style: { color: "white" } }, { str: amount + "x ", style: { color: "slateGray" } }, { str: itemName, style: { color: "lime" } }]);

                    //api.sendMessage(adminId, [{str: "[ILLEGAL ITEM] ", style: {color: "red"}}, {str//: playerName + " had " + amount + "x " + itemName, style: {color: "white"}}]);				

                    //[{ str: "Starting: ", style: { color: "lime" } },
                    //{ str: "\nParkour Attack!", style: { color: "Red" } }]
                }
            }
        }
    }
}


function onPlayerAltAction(id) {
    checkCustomAbility(id);
}

function onPlayerDamagingMob(id, mobid, dmg) {
    /*api.sendFlyingMiddleMessage(
        id,
        [
            {
                str: "-" + dmg.toString(),
                style: { color: "orangered"}
            },
            {
                str: " (" + api.getHealth(mobid) + ")",
                style: { color: "lightgray" }
            }
        ],
        100,
        400
    );*/
}

function onPlayerDamagingOtherPlayer(id, dmgid, dmg, weapon) {
    const pos = api.getPosition(id);
    api.log(weapon);

    const minCoords1 = [46, 1, 90];
    const maxCoords1 = [7, 30, 50];

    const minCoords2 = [-65, 1, -14];
    const maxCoords2 = [-115, 100, 36];

    if (api.isInsideRect(pos, minCoords1, maxCoords1, true)) {
        return null;
    } else if (api.isInsideRect(pos, minCoords2, maxCoords2, true)) {
        return null;
    } else {
        //return "preventDamage";
    }

    // Player is inside the zone, show damage
    /*api.sendFlyingMiddleMessage(
        id,
        [
            {
                str: "-" + dmg.toString(),
                style: { color: "#ff4444" }
            },
            {
                str: " (" + api.getHealth(dmgid) + ")",
                style: { color: "#aaaaaa" }
            }
        ],
        100,
        400
    );*/
}

function onChestUpdated(id, isMoonstone) {
    if (!isMoonstone) return;

    const slot35 = api.getMoonstoneChestItemSlot(id, 35);

    // If slot 35 is missing or altered
    if (!slot35 || slot35.name !== "Purple Portal") {

        // Restore the correct item
        updateData(id);

        api.sendMessage(
            id,
            "This item cannot be removed.",
            { color: "red" }
        );
    }
}

/* ===== DATA ===== */
function getData(id, key) {
    let chest0 = api.getMoonstoneChestItemSlot(id, 35);
    if (chest0?.attributes?.customAttributes?.[key] !== undefined) {
        return chest0.attributes.customAttributes[key];
    }
}

function updateData(id) {
    let stats = playerStats[id];
    if (!stats) return;

    api.setMoonstoneChestItemSlot(id, 35, "Purple Portal", 1, {
        customDisplayName: "Player Data",
        customDescription:
            `Your Player Data\n` +
            `Coins = ${stats.coins}\n` +
            `Kills = ${stats.kills}\n` +
            `Deaths = ${stats.deaths}\n` +
            `Rebirths = ${stats.rebirths}\n` +
            `Multiplier = ${stats.mult}x`,
        customAttributes: {
            coins: stats.coins,
            kills: stats.kills,
            deaths: stats.deaths,
            rebirths: stats.rebirths,
            mult: stats.mult,
            muted: stats.muted,
            rank: stats.rank,
            level: stats.level,
            xp: stats.xp
        }
    });
}

function onWorldAttemptSpawnMob(mobType, x, y, z) {
    //return "preventSpawn";
}

/* ===== PLAYER JOIN/LEAVE ===== */
function onPlayerJoin(id) {

    initialisePlayer(id);
}

function onPlayerLeave(id) {
    updateData(id);
    delete playerStats[id];
}

function tick() {

    if (api.isNearInterrupt()) {
        return;
    }

    if (!codeLoaded) {

        const pos =
            CODE[codeLoadIndex];

        if (
            loadCode(
                pos[0],
                pos[1],
                pos[2]
            )
        ) {

            codeLoadIndex++;

            if (
                codeLoadIndex >=
                CODE.length
            ) {

                codeLoaded = true;

                api.log(
                    "Lobby Successfully Initialised!"
                );
            }
        }

        return;
    }


    terrainTick();



    for (let id of api.getPlayerIds()) {


        if (playerStats[id]?.initialised) {
            // ===== ANTI-ILLEGAL ITEM SWEEP =====
            purgeIllegalItems(id);


            checkForCustomItems(id);

            // ===== DEATH DETECTION =====
            const hp = api.getHealth(id);
            if (hp <= 0 && !wasDead[id]) {
                wasDead[id] = true;
                handleDeath(id);
            }
            if (hp > 0) {
                wasDead[id] = false;
            }
        } else {

            initialisePlayer(id);

        }
    }

    // ===== INFERNO RING CLEANUP =====

    for (let i = infernoRings.length - 1; i >= 0; i--) {

        const ring = infernoRings[i];

        if (api.now() >= ring.removeTime) {

            for (const block of ring.blocks) {

                const [bx, by, bz] = block;

                // Only remove lava
                if (api.getBlock(bx, by, bz) === "Lava") {
                    api.setBlock(bx, by, bz, "Air");
                }
            }

            infernoRings.splice(i, 1);
        }
    }
}
