function spawnPerson(x, y, z, rotation, textures) {
    var personId = api.attemptCreateMeshEntity("Person", {
        size: 1,
        pose: "standing",
        textures: textures
    }, "[ERROR]");

    api.setPosition(personId, x, y, z);

    

    // Adjust this depending on which rotation function Bloxd uses
    api.setEntityRotation(personId, rotation[0], rotation[1], rotation[2]);

    return personId;
}

var npc = spawnPerson(
    -125.5,
    2,
    33.5,
    [0, -4.712, 0],
    {
        hat: "hat_27_2",
        body: "body_27_2",
        legs: "legs_23",
        shoes: "shoes_18",
        skin: "skin_0_12"
    }

);

meshEntities.push(npc);
npcs.push(npc);

api.setTargetedPlayerSettingForEveryone(npc, "nameTagInfo", {
    content: [{ str: "Solo", style: { color: "#FFD700", fontSize: "250" } }],
    backgroundColor: "rgba(0,0,0,0)",
    subtitle: [{ str: "", style: { color: "rgba(0,0,0,0)", fontSize: "100" } }],
    subtitleBackgroundColor: "rgba(0,0,0,0)"
}
);
