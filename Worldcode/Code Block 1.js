function updatePlayerStats(id, stat, amount) {
    if (!playerStats[id]) return;

    playerStats[id][stat] += amount;

    api.sendMessage(id, "+" + amount + " " + stat + "!", { color: "yellow" });

    updateSideBar(id);

    const name = isAdmin(api.getPlayerDbId(id))
        ? `[Admin] [${getAdminRole(api.getPlayerDbId(id))}] ${playerStats[id].name}`
        : playerStats[id].name;

    api.setTargetedPlayerSettingForEveryone(id, "lobbyLeaderboardValues", {
        Name: name,
        rank: playerStats[id].rank,
        coins: playerStats[id].coins,
        kills: playerStats[id].kills,
        deaths: playerStats[id].deaths,
        rebirths: playerStats[id].rebirths
    });
}

function updateSideBar(id) {
    let stats = playerStats[id];

    const nextXP = xpForNextLevel(stats.level);
    const xpPercent = Math.floor((stats.xp / nextXP) * 10); // 10 segments

    // Build XP bar string
    let xpBar = "";
    for (let i = 0; i < 10; i++) {
        xpBar += i < xpPercent ? "■" : "□"; // filled vs empty
    }

    api.setClientOption(id, "RightInfoText", [
        { str: "Bloxd", style: { fontSize: "40px", color: "#00bfff" } },
        { str: " Battle\n", style: { fontSize: "40px", color: "#1e90ff" } },

        { icon: "\nfa-solid fa-crown", style: { color: "#ffd700" } },
        { str: ` Owner: L_Fox\n`, style: { color: "#ffd700" } },

        { icon: "fa-solid fa-star", style: { color: "#ffd700" } },
        { str: ` Rank: ${stats.rank}\n`, style: { color: "#ffd700" } },

        { icon: "fa-solid fa-trophy", style: { color: "#00ffff" } },
        { str: ` Level: ${stats.level}\n`, style: { color: "#00ffff" } },

        { icon: "fa-solid fa-bolt", style: { color: "#ff4500" } },
        { str: ` XP: ${stats.xp} / ${nextXP} [${xpBar}]\n\n`, style: { color: "#ff4500" } },

        { icon: "fa-solid fa-coins", style: { color: "#00ffff" } },
        { str: ` Coins: ${stats.coins}\n`, style: { color: "#00ffff" } },

        { icon: "fa-solid fa-fist-raised", style: { color: "#32cd32" } },
        { str: ` Kills: ${stats.kills}\n`, style: { color: "#32cd32" } },

        { icon: "fa-solid fa-person-falling-burst", style: { color: "#ff0000" } },
        { str: ` Deaths: ${stats.deaths}\n`, style: { color: "#ff0000" } }
    ]);
}

function initPlayerXP(id) {
    const stats = playerStats[id];
    if (!stats.xp) stats.xp = 0;       // Current XP in level
    if (!stats.level) stats.level = 1; // Current level
    if (!stats.rank) stats.rank = RANK_ORDER[0];
}

// XP needed for next level, increases exponentially
function xpForNextLevel(level) {
    return Math.floor(50 * Math.pow(1.5, level - 1)); // Adjust curve
}


function addXP(id, amount) {
    const stats = playerStats[id];
    stats.xp += amount;
    api.sendMessage(id, "+" + amount + " XP!", { color: "yellow" });

    while (stats.xp >= xpForNextLevel(stats.level)) {
        stats.xp -= xpForNextLevel(stats.level); // reset for next level
        stats.level++;
        stats.rank = RANK_ORDER[Math.min(stats.level - 1, RANK_ORDER.length - 1)];
        api.sendMessage(id, `🎉 Level Up! You are now ${stats.rank} (Level ${stats.level})!`, { color: "#ffd700" });
        subtitle(id);

        let [x, y, z] = api.getPosition(id);
        y += 1; // slightly above head

        api.playParticleEffect({
            pos1: [x, y, z],
            pos2: [x, y, z], // burst from one point

            dir1: [-1, -1, -1],
            dir2: [1, 1, 1],

            texture: "glint",

            minLifeTime: 0.3,
            maxLifeTime: 0.5,

            minEmitPower: 2,
            maxEmitPower: 4,

            minSize: 0.3,
            maxSize: 0.45,

            manualEmitCount: 100,

            gravity: [0, -1.5, 0], // slight fall, not heavy

            colorGradients: [
                {
                    timeFraction: 0,
                    minColor: [255, 215, 0, 1],     // bright gold
                    maxColor: [255, 255, 150, 1],   // glowing yellow
                },
                {
                    timeFraction: 0.6,
                    minColor: [255, 170, 0, 0.8],   // warm gold
                    maxColor: [255, 140, 0, 0.8],
                },
                {
                    timeFraction: 1,
                    minColor: [255, 100, 0, 0],     // fade out
                    maxColor: [255, 140, 0, 0],
                }
            ],

            velocityGradients: [
                {
                    timeFraction: 0,
                    factor: 1.5,
                    factor2: 2,
                },
                {
                    timeFraction: 1,
                    factor: 0.2,
                    factor2: 0.3,
                },
            ],

            blendMode: 1,
        });
    }

    updateSideBar(id); // Update XP bar and info
}

function handleDeath(id) {
    if (!playerStats[id]) return;

    // Ignore void deaths
    if (isVoidDeath(id)) {
        return;
    }

    // Increase deaths
    playerStats[id].deaths += 1;

    // Update UI + leaderboard
    updateSideBar(id);

    const name = isAdmin(api.getPlayerDbId(id))
        ? `[Admin] [${getAdminRole(api.getPlayerDbId(id))}] ${playerStats[id].name}`
        : playerStats[id].name;

    api.setTargetedPlayerSettingForEveryone(id, "lobbyLeaderboardValues", {
        Name: name,
        rank: playerStats[id].rank,
        coins: playerStats[id].coins,
        kills: playerStats[id].kills,
        deaths: playerStats[id].deaths,
        rebirths: playerStats[id].rebirths
    });
}
