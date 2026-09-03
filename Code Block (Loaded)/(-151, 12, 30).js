const attackPose = {
    animation_length: 10000000,
    loop: true,

    bones: {
        TorsoNode: {
            rotation: [-10, 0, 0]
        },

        HeadMesh: {
            rotation: [8, 0, 0]
        },

        ArmLeftMesh: {
            rotation: [120, -50, -30]
        },

        ArmRightMesh: {
            rotation: [70, 10, -30]
        },

        LegLeftMesh: {
            rotation: [-32, 0, 0]
        },

        LegRightMesh: {
            rotation: [25, 0, 0]
        }
    }

};

for (var i = 0; i < npcs.length; i++) {

    api.animateEntity(npcs[i], attackPose, 0, 1);

    api.updateEntityNodeMeshAttachment(
        npcs[i],
        "ArmRightMesh",
        "BloxdBlock",
        {
            blockName: "Diamond Sword",
            size: Math.PI / 10
        },
        [-0.03, -0.85, 0.15],
        [Math.PI, Math.PI / 2 + 0.08, 0]
    );


}

taskId = ts.setTimeout(
    () => {
        if (api.isBlockInLoadedChunk(-196.5, 3, 33.5)) {
            api.setPosition(npc, -196.5, 3, 33.5);
            ts.cancelTask(taskId)
        }
    },
    10,
    true
);
