function subtitle(id) {
    if (isAdmin(api.getPlayerDbId(id))) {
        api.setTargetedPlayerSettingForEveryone(id, "nameTagInfo", {
            subtitle: [
                { str: "[Admin] ", style: { color: "#ffaa00", fontWeight: "bold" } },
                { str: "[" + getAdminRole(api.getPlayerDbId(id)) + "]", style: { color: getRoleColor(getAdminRole(api.getPlayerDbId(id))), fontWeight: "bold" } }
            ],
            subtitleBackgroundColor: "rgba(0,0,0,0)"
        }, true);
    } else {
        api.setTargetedPlayerSettingForEveryone(id, "nameTagInfo", {
            subtitle: [
                { str: "[" + playerStats[id].rank + "]", style: { color: RANK_COLORS[playerStats[id].rank] || "#ffffff", fontWeight: "bold" } }
            ],
            subtitleBackgroundColor: "rgba(0,0,0,0)"
        }, true);
    }
}

function startAdminAura(id) {
    const roleColor = getRoleColor(getAdminRole(api.getPlayerDbId(id)));
    const colorRange = variedRGBA(roleColor, 25);

    api.updateEntityNodeMeshAttachment(
        id,
        "LegLeftMesh",
        "ParticleEmitter",
        {
            emitRate: 150,
            meshOffset: [0, 0, 0],
            width: 0.8,
            height: 0,
            depth: 0.8,
            texture: "square_particle",

            minLifeTime: 0.3,
            maxLifeTime: 0.5,

            minEmitPower: 1,
            maxEmitPower: 1.2,

            minSize: 0.18,
            maxSize: 0.28,

            gravity: [0, 0, 0],

            colorGradients: [
                {
                    timeFraction: 0,
                    minColor: colorRange.min,
                    maxColor: colorRange.max
                }
            ],

            velocityGradients: [
                {
                    timeFraction: 0,
                    factor: 1,
                    factor2: 1
                }
            ],

            blendMode: 1
        },
        [-0.15, -0.7, 0]
    );
}

function stopAdminAura(id) {
    api.updateEntityNodeMeshAttachment(id, "LegLeftMesh", "ParticleEmitter");
}

function initialisePlayer(id) {
    const dbid = api.getPlayerDbId(id);
    const name = api.getEntityName(id);

    scanChestToAdmins(0, -1, 0);

    api.sendMessage(id, "Hello! this lobby is still a work in progress, there may be a few bugs", { color: "lime" });

    playerStats[id] = {
        coins: getData(id, "coins") || 0,
        kills: getData(id, "kills") || 0,
        deaths: getData(id, "deaths") || 0,
        rebirths: getData(id, "rebirths") || 0,
        mult: getData(id, "mult") || 1,
        name,
        particlesEnabled: false,
        initialised: true,
        muted: getData(id, "muted") || false,
        level: getData(id, "level") || 1,
        xp: getData(id, "xp") || 0,
        rank: getData(id, "rank") || "Novice"
    };

    updateSideBar(id);
    api.setClientOption(id, "autoRespawn", true);
    api.setClientOption(id, "secsToRespawn", 0);

    api.setClientOption(id, "lobbyLeaderboardInfo", {
        Name: { displayName: "Name", sortPriority: 0 },
        rank: { displayName: "Rank", sortPriority: 1 },
        coins: { displayName: "Coins", sortPriority: 2 },
        kills: { displayName: "Kills", sortPriority: 3 },
        deaths: { displayName: "Deaths", sortPriority: 4 },
        rebirths: { displayName: "Rebirths", sortPriority: 5 }
    });

    // Update leaderboard for this player
    api.setTargetedPlayerSettingForEveryone(id, "lobbyLeaderboardValues", {
        Name: name,
        rank: playerStats[id].rank,
        coins: playerStats[id].coins,
        kills: playerStats[id].kills,
        deaths: playerStats[id].deaths,
        rebirths: playerStats[id].rebirths
    });

    subtitle(id);

    // Apply admin visuals for the joining player if they are admin
    if (isAdmin(dbid)) {
        api.setClientOption(id, "chatChannels", [
            {
                channelName: "Global",
                elementContent: [{ icon: "fa-solid fa-globe" }, " Global"],
                elementBgColor: "#3c70d0"
            },
            {
                channelName: "Staff",
                elementContent: [{ icon: "fa-solid fa-shield" }, " Staff"],
                elementBgColor: "#73e88c"
            }]);

        api.setTargetedPlayerSettingForEveryone(id, "colorInLobbyLeaderboard", getRoleColor(getAdminRole(dbid)));
        api.setTargetedPlayerSettingForEveryone(id, "lobbyLeaderboardValues", {
            Name: `[Admin] [${getAdminRole(dbid)}] ${name}`,
            rank: playerStats[id].rank,
            coins: playerStats[id].coins,
            kills: playerStats[id].kills,
            deaths: playerStats[id].deaths,
            rebirths: playerStats[id].rebirths
        });

        // Optional: Give admin creative mode
        api.setClientOption(id, "creative", true);
        playerStats[id].canFly = true;
        playerStats[id].particlesEnabled = true;
        startAdminAura(myId);
    }

    // Ensure the new joiner sees all existing admins correctly
    for (let otherId of api.getPlayerIds()) {
        subtitle(otherId);
        if (isAdmin(api.getPlayerDbId(otherId))) {
            api.setTargetedPlayerSettingForEveryone(otherId, "colorInLobbyLeaderboard", getRoleColor(getAdminRole(api.getPlayerDbId(otherId))));
        }
    }
}
