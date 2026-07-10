function checkForCustomItems(id) {
    for (let item of CUSTOM_ITEMS) {
        if (api.hasItem(id, item)) {
            if (item === "Red Portal") {
                api.removeItemName(id, item, 1);
                api.giveItem(id, "Gold Sword", 1, {
                    customDisplayName: "Demon Blade",
                    customDescription: "Infernal Ring - Right Click To Activate Ability\nHas 70 Second Cooldown",
                    customAttributes: { infernalRing: true }
                });
            }
            if (item === "Black Portal") {
                api.removeItemName(id, item, 1);
                api.giveItem(id, "Stone Sword", 1, {
                    customDisplayName: "Shadow Fang",
                    customDescription: "Shadow Cloak - Right Click To Activate Ability\nHas 90 Second Cooldown",
                    customAttributes: { shadowCloak: true }
                });
            }
        }
    }


}



function checkCustomAbility(id) {
    var item = api.getHeldItem(id);

    if (!item) return;

    if (item.attributes.customAttributes.infernalRing === true) {

        if (api.hasEffect(id, "Demon Blade") === false) {

            api.applyEffect(id, "Heat Resistance", 10000, { inbuiltLevel: 1 });

            api.applyEffect(id, "Inferno Ring", 3000, {
                inbuiltLevel: 1,
                icon: "Caught Mob Magma_Golem Default",
                displayName: "Inferno Ring"
            });

            api.applyEffect(id, "Blindness", 5000, {
                inbuiltLevel: 1,
            });

            api.applyEffect(id, "Demon Blade", 70000, {
                inbuiltLevel: 1,
                icon: "Gold Sword",
                displayName: "Demon Blade Cooldown"
            });

            const pos = api.getPosition(id);

            let lavaBlocks = [];

            for (let x = -2; x <= 2; x++) {
                for (let z = -2; z <= 2; z++) {

                    const bx = Math.floor(pos[0]) + x;
                    const by = Math.floor(pos[1]);
                    const bz = Math.floor(pos[2]) + z;

                    // Only replace air
                    if (api.getBlock(bx, by, bz) === "Air") {

                        api.setBlock(bx, by, bz, "Lava");

                        lavaBlocks.push([bx, by, bz]);
                    }
                }
            }

            // Save ring data
            infernoRings.push({
                blocks: lavaBlocks,
                removeTime: api.now() + 3000
            });

        } else {

            api.sendFlyingMiddleMessage(
                id,
                [{
                    str: "Demon Blade\nOn Cooldown!",
                    style: { color: "red" }
                }],
                500,
                500
            );
        }
    }

    if (item.attributes.customAttributes.shadowCloak === true) {

        if (api.hasEffect(id, "Shadowfang") === false) {

            api.applyEffect(id, "Speed", 3000, { inbuiltLevel: 3 });

            api.applyEffect(id, "Invisible", 3000, {
                inbuiltLevel: 1,
            });

            api.applyEffect(id, "Shadowfang", 70000, {
                inbuiltLevel: 1,
                icon: "Stone Sword",
                displayName: "Shadowfang Cooldown"
            });
            
        } else {

            api.sendFlyingMiddleMessage(
                id,
                [{
                    str: "Shadowfang\nOn Cooldown!",
                    style: { color: "red" }
                }],
                500,
                500
            );
        }
    }

}





function hexToRGBA(hex, alpha = 1) {
    hex = hex.replace("#", "");
    const bigint = parseInt(hex, 16);
    return [
        (bigint >> 16) & 255,
        (bigint >> 8) & 255,
        bigint & 255,
        alpha
    ];
}

function variedRGBA(hex, variance = 25, alpha = 1) {
    const [r, g, b] = hexToRGBA(hex, alpha);

    function clamp(v) {
        return Math.max(0, Math.min(255, v));
    }

    return {
        min: [
            clamp(r - variance),
            clamp(g - variance),
            clamp(b - variance),
            alpha
        ],
        max: [
            clamp(r + variance),
            clamp(g + variance),
            clamp(b + variance),
            alpha
        ]
    };
}

function isVoidDeath(id) {
    const pos = api.getPosition(id);
    return pos && pos[1] < VOID_Y_LEVEL;
}

function adminCommands(id, cmd, args) {
    if (cmd === "adminhelp") {
        api.sendMessage(
            id,
            "Admin only commands:\n" +
            "/heal - heals you (survival only)\n" +
            "/fly - toggles flight for yourself\n" +
            "/vanish - toggles invisibility for yourself\n" +
            "/spectate <name> - spectate a player\n" +
            "/freeze <name> - freeze on a player\n" +
            "/clear <name> - clears a player's inventory\n" +
            "/particles - toggles admin particle effects for yourself",
            { color: "whitesmoke" }
        );
        return true;
    }

    if (cmd === "heal") {
        api.applyHealthChange(id, 10000, id);
        api.sendMessage(id, "You have been healed!", { color: "lime" });
        return true;
    }

    if (cmd === "clear") {
        let playerid = api.getPlayerId(args.toString());
        if (playerid === null) {
            api.sendMessage(id, "Player not found!\nProper use /clear [name]", { color: "red" });
            return true;
        }
        api.clearInventory(playerid);
        api.sendMessage(id, args + "'s Inventory Cleared", { color: "lime" });
        return true;
    }

    if (cmd === "mute") {

        if (args.length < 1) {
            api.sendMessage(id, "Usage: /mute <player>", { color: "red" });
            return true;
        }

        const targetId = api.getPlayerId(args[0]);

        if (!targetId) {
            api.sendMessage(id, "Player not found!", { color: "red" });
            return true;
        }

        if (targetId === id) {
            api.sendMessage(id, "You cannot mute yourself!", { color: "red" });
            return true;
        }

        if (!playerStats[targetId]) {
            playerStats[targetId] = {};
        }

        playerStats[targetId].muted = !playerStats[targetId].muted;

        updateData(targetId); // 👈 SAVE TO MOONSTONE

        api.sendMessage(
            id,
            `${args[0]} has been ${playerStats[targetId].muted ? "muted" : "unmuted"}.`,
            { color: playerStats[targetId].muted ? "yellow" : "lime" }
        );

        api.sendMessage(
            targetId,
            `You have been ${playerStats[targetId].muted ? "muted" : "unmuted"} by an admin.`,
            { color: playerStats[targetId].muted ? "red" : "cyan" }
        );

        return true;
    }

    if (cmd === "fly") {
        // Initialize fly state if undefined
        if (playerStats[id].canFly === undefined) playerStats[id].canFly = false;

        // Toggle fly
        playerStats[id].canFly = !playerStats[id].canFly;

        api.setClientOption(id, "creative", playerStats[id].canFly);
        api.sendMessage(
            id,
            `Flight has been ${playerStats[id].canFly ? "enabled" : "disabled"}`,
            { color: "pink" }
        );
        return true;
    }

    if (cmd === "vanish") {

        // Initialize if undefined
        if (playerStats[id].vanished === undefined) {
            playerStats[id].vanished = false;
        }

        // Toggle vanish
        playerStats[id].vanished = !playerStats[id].vanished;

        // Hide player from others
        api.setTargetedPlayerSettingForEveryone(
            id,
            "canSee",
            !playerStats[id].vanished
        );

        // ✅ Show / clear middle text
        if (playerStats[id].vanished) {
            api.setClientOption(id, "middleTextLower", [{
                str: "You are Vanished",
                style: { color: "purple", fontWeight: "bold" }
            }]);
        } else {
            // Clear it
            api.setClientOption(id, "middleTextLower", "");
        }

        api.sendMessage(
            id,
            `Vanish has been ${playerStats[id].vanished ? "enabled" : "disabled"}`,
            { color: "purple" }
        );

        return true;
    }

    if (cmd === "freeze") {

        if (args.length < 1) {
            api.sendMessage(id, "Usage: /freeze <player>", { color: "red" });
            return true;
        }

        const targetName = args[0];
        const targetId = api.getPlayerId(targetName);

        if (!targetId) {
            api.sendMessage(id, "Player not found!", { color: "red" });
            return true;
        }

        if (targetId === id) {
            api.sendMessage(id, "You cannot freeze yourself!", { color: "red" });
            return true;
        }

        // Ensure stats object exists 
        if (!playerStats[targetId]) {
            playerStats[targetId] = {};
        }

        // 🔁 TOGGLE LOGIC
        if (playerStats[targetId].frozen) {

            // UNFREEZE
            api.removeEffect(targetId, "Frozen By Admin");
            api.setClientOption(targetId, "speedMultiplier", 1);

            playerStats[targetId].frozen = false;

            api.sendMessage(id, `${targetName} has been unfrozen.`, { color: "lime" });
            api.sendMessage(targetId, "You are no longer frozen.", { color: "cyan" });

        } else {

            // FREEZE
            api.applyEffect(targetId, "Frozen By Admin", null, {
                icon: "Caught Mob Frost_Zombie Default"
            });

            api.setClientOption(targetId, "speedMultiplier", 0);

            playerStats[targetId].frozen = true;

            api.sendMessage(id, `${targetName} has been frozen. ❄️`, { color: "cyan" });
            api.sendMessage(targetId, "You have been frozen by an admin! ❄️", { color: "red" });
        }

        return true;
    }

    if (cmd === "particles") {
        playerStats[id].particlesEnabled = !playerStats[id].particlesEnabled;

        if (playerStats[id].particlesEnabled === true) {
            startAdminAura(id);
        } else {
            stopAdminAura(id);
        }

        api.sendMessage(id, `Particles are now ${playerStats[id].particlesEnabled ? "ON" : "OFF"}`, { color: "cyan" });
        return true;
    }

    if (cmd === "op") {

        if (!args) {
            api.sendMessage(id, "Usage: /op <name> <rank>", { color: "red" });
            return true;
        }

        const targetName = args[0];
        const rank = args[1];

        if (!targetName || !rank) {
            api.sendMessage(id, "Usage: /op <name> <rank>", { color: "red" });
            return true;
        }

        // ✅ Use built-in function
        const targetId = api.getPlayerId(targetName);

        if (!targetId) {
            api.sendMessage(id, "Player not found!", { color: "red" });
            return true;
        }

        const dbid = api.getPlayerDbId(api.getPlayerId(targetName));

        // Add to chest
        api.giveStandardChestItem([0, -1, 0], "Diamond Pickaxe", 1, id, {
            customDisplayName: targetName + " - " + rank,
            customDescription: api.getPlayerDbId(targetId)
        });

        // Update admin list instantly
        scanChestToAdmins(0, -1, 0);
        initialisePlayer(id);

        api.sendMessage(id, `${targetName} is now ${rank}`, { color: "lime" });

        return true;
    }
}

function playerCommands(id, cmd, args) {
    if (cmd === "recipes") {
        api.sendMessage(
            id,
            "Custom Recipes:\n" +
            "Demon Blade:\n" +
            "Found as Red Portal in Workbench\n" +
            "Crafted with:\n" +
            "1x Diamond Sword\n" +
            "8x Obsidian\n" +
            "6x Red Wool\n" +
            "4x Gold Bar\n" +
            "10x Coal\n" +
            "2x Lava Bucket\n",
            { color: "whitesmoke" }
        );
        return true;
    }
}
