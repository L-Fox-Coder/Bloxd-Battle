function spawnNametag(pos, mainBgColor, mainText, mainSize, mainColour, subText, subSize, subColour, subBgColor, height) {
    var id = api.attemptSpawnMob("Wildcat", pos[0], pos[1], pos[2], { physicsOpts: { collidesEntities: false } });

    if (id) {
        api.setPosition(id, pos);
        api.applyEffect(id, "Frozen", null, {});
        api.scalePlayerMeshNodes(id, { "TorsoNode": [0, height, 0] });

        api.setTargetedPlayerSettingForEveryone(id, "nameTagInfo", {
            backgroundColor: mainBgColor,
            content: [{ str: mainText, style: { fontSize: mainSize + "px", color: mainColour } }],
            subtitle: [{ str: subText + "", style: { fontSize: subSize + "px", color: subColour } }],
            subtitleBackgroundColor: subBgColor
        }, true);
    }
}

spawnNametag([-180, 3, -35], "rgba(0,0,0,0)", "Credits:", 150, "rgba(255, 170, 0, 1)", "", 50, "rgba(220,170,255,1)", "rgba(0,0,0,0)", 3.8);

spawnNametag([-175, 3, -35], "rgba(0,0,0,0)", "Builds:", 100, "rgba(51, 255, 170, 1)", "", 50, "rgba(90,220,255,1)", "rgba(0,0,0,0)", 3);

spawnNametag([-175, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "SkullfireMan", 70, "rgba(255,255,255,1)", "rgba(0,0,0,0)", 2.8);

spawnNametag([-175, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "Canfire", 70, "rgba(255,255,255,1)", "rgba(0,0,0,0)", 2.3);

spawnNametag([-175, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "Hacker_163_Gaming", 70, "rgba(255,255,255,1)", "rgba(0,0,0,0)", 1.8);

spawnNametag([-180, 3, -35], "rgba(0,0,0,0)", "Code:", 100, "rgba(51, 136, 255, 1)", "", 50, "rgba(190,120,255,1)", "rgba(0,0,0,0)", 3);

spawnNametag([-180, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "L_Fox", 70, "rgba(255,225,255,1)", "rgba(0,0,0,0)", 2.8);

spawnNametag([-185, 3, -35], "rgba(0,0,0,0)", "Playtesting:", 100, "rgba(0, 184, 217, 1)", "", 50, "rgba(255,110,190,1)", "rgba(0,0,0,0)", 3);

spawnNametag([-185, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "ZyTrexer", 70, "rgba(255,240,250,1)", "rgba(0,0,0,0)", 2.8);

spawnNametag([-185, 3, -35], "rgba(0,0,0,0)", "", 45, "rgba(255,255,255,1)", "L0ne_Surviv0r", 70, "rgba(255,235,250,1)", "rgba(0,0,0,0)", 2.3);
