import { ts } from "./ts.js";

var playerStats = {};

var visualState = {};
let counter = 0;
var infernoRings = [];

var terrainGenerating = false;
var terrainDelay = 0;
var terrainSeed = 0;
var terrainCenterX = 0;
var terrainCenterZ = 0;
var terrainBottomY = 0;
var terrainRadius = 0;
var terrainBaseHeight = 0;
var terrainChunkSize = 16;
var terrainCurrentChunkX = 0;
var terrainCurrentChunkZ = 0;

var undergroundCurrentX = 0;
var undergroundCurrentZ = 0;
var undergroundGenerating = false;
var undergroundDelay = 0;
var undergroundChunkSize = 16;
var undergroundBlockCount = 0;

var totalChunks = 0;
var completedChunks = 0;
var terrainBlockCount = 0;
var terrainStartTime = 0;

var CratePosC = [];
var CratePosU = [];
var CratePosR = [];
var CratePosE = [];
var CratePosL = [];
var CratePosM = [];

var meshEntities = [];
var npcs = [];


var CODE = [
    [-151, 12, 41],
    [-151, 12, 40],
    [-151, 12, 39],
    [-151, 12, 38],
    [-151, 12, 37],
    [-151, 12, 36],
    [-151, 12, 35],
    [-151, 12, 34],
    [-151, 12, 33],
    [-151, 12, 32],
    [-151, 12, 31],
    [-151, 12, 30]
];

var codeLoaded = false;
var codeLoadIndex = 0;

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

var ILLEGAL_ITEMS = [
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

function onPlayerJoin(id) {

    var n = api.getEntityName(id);

    if (n === "L_Fox" || n === "MBA_303" || n === "ABA_303" || n === "TheNightmareOG" || n === "Canfire" || n === "SUStreason" || n === "L0ne_Surviv0r" || n === "ZyTrexer") {
        api.setPlayerGamemode(id, "creative");
    } else {
        api.kickPlayer(id, "Bloxd Battle is still in development, join the discord server to get the latest updates!\nhttps://" + "discord." + "gg/" + "pRVTDWHxbP");
    }

    api.setPosition(id, -125.5, 2, 33.5);


    if (codeLoaded) {

        initialisePlayer(id);

        if (
            playerStats[id].ban &&
            playerStats[id].ban.expires > api.now()
        ) {
            api.kickPlayer(id, "A Moderator has banned you for: " + playerStats[id].ban.reason);
        }
    }
}

function onPlayerBoughtShopItem(id, category, shopItem, temp, input) {
    const times = {
        "10m": 10 * 60 * 1000,
        "30m": 30 * 60 * 1000,
        "1h": 1 * 60 * 60 * 1000,
        "2h": 2 * 60 * 60 * 1000,
        "4h": 4 * 60 * 60 * 1000,
        "8h": 8 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "48h": 48 * 60 * 60 * 1000,
        "72h": 72 * 60 * 60 * 1000,
        "96h": 96 * 60 * 60 * 1000,
        "120h": 120 * 60 * 60 * 1000,
        "144h": 144 * 60 * 60 * 1000,
        "168h": 168 * 60 * 60 * 1000
    };

    if (!playerStats[id]) {
        playerStats[id] = {};
    }

    if (category === "Moderation" && shopItem === "Player") {
        playerStats[id].selectedPlayer = input;
        api.sendOverShopInfo(id, "Selected Player: " + api.getEntityName(input));
    }

    if (category === "Moderation" && shopItem === "Reason") {
        playerStats[id].enteredReason = input;
        api.sendOverShopInfo(id, "Entered Reason: " + input);
    }

    if (category === "Moderation" && shopItem === "Mute") {
        if (playerStats[id].selectedPlayer && playerStats[id].enteredReason) {
            var reason = playerStats[id].enteredReason;
            var duration = times[input.toLowerCase()];
            var name = api.getEntityName(id);
            var targetId = playerStats[id].selectedPlayer;
            var durationText = input;

            const muteData = {
                reason,
                expires: api.now() + duration,
                by: name
            };

            if (!playerStats[targetId].mute) playerStats[targetId].mute = {};

            playerStats[targetId].mute = muteData;

            updateData(targetId);

            api.sendOverShopInfo(id, "Muting Player: " + api.getEntityName(targetId) + " for " + input + " due to " + reason);
            api.sendMessage(targetId, "A Moderator Has Muted You For " + input + " Due To " + reason);

        } else if (!playerStats[id].selectedPlayer) {
            api.sendOverShopInfo(id, "No Player Selected!");
        } else if (!playerStats[id].enteredReason) {
            api.sendOverShopInfo(id, "No Reason Entered!");
        }
    }

    if (category === "Moderation" && shopItem === "Ban") {
        if (playerStats[id].selectedPlayer && playerStats[id].enteredReason) {
            var reason = playerStats[id].enteredReason;
            var duration = times[input.toLowerCase()];
            var name = api.getEntityName(id);
            var targetId = playerStats[id].selectedPlayer;
            var durationText = input;

            const banData = {
                reason,
                expires: api.now() + duration,
                by: name
            };

            if (!playerStats[targetId].ban) playerStats[targetId].ban = {};

            playerStats[targetId].ban = banData;

            updateData(targetId);

            api.sendOverShopInfo(id, "Banning Player: " + api.getEntityName(targetId) + " for " + input + " due to " + reason);
            api.kickPlayer(targetId, "A Moderator Has Banned You For " + input + " Due To " + reason);

        } else if (!playerStats[id].selectedPlayer) {
            api.sendOverShopInfo(id, "No Player Selected!");
        } else if (!playerStats[id].enteredReason) {
            api.sendOverShopInfo(id, "No Reason Entered!");
        }
    }
}


function onPlayerChat(id, message, channel) {

    const admin = isAdmin(id);

    if (!playerStats[id].initialised) {
        return false;
    }

    if (
        playerStats[id].mute &&
        playerStats[id].mute.expires > api.now()
    ) {

        api.sendMessage(
            id,
            "You are muted by an admin for reason: " +
            playerStats[id].mute.reason,
            { color: "red" }
        );

        return false;
    }

    const prefix = [];

    if (channel === "Staff") {
        prefix.push({
            str: "[Staff Chat] ",
            style: {
                color: "#73e88c"
            }
        });
    }

    if (admin) {

        prefix.push({
            str: "[Admin] ",
            style: {
                color: CHAT_COLORS.adminPrefix
            }
        });

        const role = getAdminRole(id);

        if (role) {

            prefix.push({
                str: "[" + role + "]",
                style: {
                    color: getRoleColor(role)
                }
            });

        }

    }


    return [prefix];

}

function playerCommand(id, command) {
    api.log(id);

    const parts = command.split(" ");
    api.log(parts);
    const cmd = parts[0];       // command name
    const args = parts.slice(1); // everything after
    api.log(args);

    if (isAdmin(id)) {
        if (adminCommands(id, cmd, args) === true) return true;
    } else {
        if (playerCommands(id, cmd, args) === true) return true;
    }
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

function onWorldAttemptSpawnMob(mobType, x, y, z) {
    if (mobType !== "Wildcat") { return "preventSpawn"; };
}

function onPlayerLeave(id) {
    updateData(id);
    delete playerStats[id];
}

function tick() {

    ts.tick();

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

function onPlayerClick(id, alt, x, y, z) {
    if (x === -197 && y === 3 || y === 4 && z === 33) {
        Queue(id, "Solo");
    }
}

function Queue(id, gamemode) {
    api.sendMessage(id, "Queued " + gamemode);
}

function loadCode(x, y, z) {

    if (api.isBlockInLoadedChunk(x, y, z)) {

        globalThis.code = api.getBlockData(x, y, z)?.persisted?.shared?.text ?? "";

    } else {
        return false;
    }


    api.broadcastMessage("Loading Code Block At: " + x + ", " + y + ", " + z);

    try {
        globalThis.eval(code);
        api.broadcastMessage("SUCCESS");
        return true;
    }
    catch (err) {
        api.broadcastMessage("FAILED:");
        api.broadcastMessage({ str: err });
        return false;
    }

}

// Check if a player is admin
function isAdmin(id) {

    var dbid = api.getPlayerDbId(id);

    return ADMINS[dbid] !== undefined;
}

function getAdminRole(id) {

    var dbid = api.getPlayerDbId(id);

    return ADMINS[dbid];
}


function getRoleColor(role) {
    return ROLE_COLORS[role];
}

function onPlayerAltAction(id) {
    checkCustomAbility(id);
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
            rank: stats.rank,
            level: stats.level,
            xp: stats.xp,

            mute: stats.mute,
            ban: stats.ban
        }
    });
}
