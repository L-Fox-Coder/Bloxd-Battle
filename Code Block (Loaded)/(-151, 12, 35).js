/*    common:

wood chestplate 2 / 3 Min+max 0-1
wood helmet 3 / 3 Min+max 1
wood leggings 2 / 3 Min+max 0-1
wood gauntelts 2 / 3 Min+max 0-1
wood boots 2 / 3 Min+max 0-1
wood sword 2 / 3 Min+max 0-1
 auraXP orb 3 / 3 Min+max 1-7
Aura XP Potion 3 / 3 Min+max 2-4
Shards(+1) 3 / 3 Min+max 1-2
Iron chestplate 1 / 3 Min+max 0-1
Iron sword 1 / 3 Min+max 0-1


uncommon:
Iron boots 1 / 3 Min+max 0-1
Iron leggings 2 / 3 Min+max 0-1
Iron Helmet 1 / 3 Min+max 0-1
Iron Chestplate 1 / 3 Min+max 0-1
Iron Gauntlets 2 / 3 Min+max 0-1
XP orb 3 / 3 Min+max 2-7
XP Bottle 3 / 3 Min+max 0-1
Shards(+1) 3 / 3 Min+max 2-4
Iron sword 2 / 3 Min+max 0-1
Stone sword 1 / 3 Min+max 0-1
Arrows 3 / 3 Min+max 2-8

rare:
Gold helmet 2 / 3 Min+max 0-1
Gold Chestplate 1 / 3 Min+max 0-1
Gold Gauntlets 1 / 3 Min+max 0-1
Gold Leggings 1 / 3 Min+max 0-1
Gold Boots 1 / 3 Min+max 0-1
Gold Sword 2 / 3 Min+max 0-1
Iron Sword 1 / 3 Min+max 0-1
Gold Bow 2 / 3 Min+max 0-1
Iron Bow 1 / 3 Min+max 0-1
Arrows 3 / 3 Min+max 6-10
XP Orb 3 / 3 Min+max 3-4
Shards (+1) 3 / 3 Min+max 3-5


epic:
Diamond helmet 1 / 3 Min+max 0-1
Diamond Chestplate 2 / 3 Min+max 0-1
Diamond Gauntlets 1 / 3 Min+max 0-1
Diamond Leggings 1 / 3 Min+max 0-1
Diamond Boots 2 / 3 Min+max 0-1
Diamond Sword 3 / 3 Min+max 1
Diamond Bow 3 / 3 Min+max 1
Arrows 3 / 3 Min+max 5-8
Shards (+1) 3 / 3 Min+max 4-5
Shards (+10) 3 / 3 Min+max 1-4

legendary:
Diamond helmet 1 / 3 Min+max 0-1
Diamond Chestplate 1 / 3 Min+max 0-1
Diamond Gauntlets 2 / 3 Min+max 0-1
Diamond Leggings 1 / 3 Min+max 0-1
Diamond Boots 2 / 3 Min+max 0-1
Diamond Sword 2 / 3 Min+max 0-1
Diamond Bow 2 / 3 Min+max 0-1
Arrows 3 / 3 Min+max 6-8
Shards (+1) 3 / 3 Min+max 2-6
Shards (+10) 3 / 3 Min+max 2-3
Diamond Crossbow 1 / 3 Min+max 0-1
Splash Speed potion II 1 / 3 Min+max 0-1
Speed potion II 1 / 3 Min+max 0-1
Shield potion II 1 / 3 Min+max 0-1
Splash Poison Potion II 1 / 3 Min+max 0-1
Knight Sword 1 / 3 0-1


mythic:
Diamond Chestplate 1 / 3 Min+max 0-1
Diamond Gauntlets 2 / 3 Min+max 0-1
Diamond Leggings 1 / 3 Min+max 0-1
Diamond Sword 2 / 3 Min+max 0-2
Arrows 3 / 3 Min+max 5-7
Shards (+1) 3 / 3 Min+max 7-9
Shards (+10) 3 / 3 Min+max 5-6
Knight Sword 2 / 3 Min+max 0-1*/








// Common

var crateItemsC = ["Wood Sword", "Wood Chestplate", "Wood Leggings", "Wood Helmet", "Wood Gauntlets", "Wood Boots", "Aura XP Orb", "Aura XP Potion", "Iron Chestplate", "Iron Sword"]; // possible items

var crateMinC = [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1]; // min amt of item for idx

var crateMaxC = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyC = 30; // item %


// Uncommon

var crateItemsU = ["Iron Sword", "Iron Chestplate", "Iron Leggings", "Stone Sword", "Iron Helmet", "Iron Gauntlets", "Iron Boots", "Aura XP Orb", "Aura XP Potion", "Iron Chestplate", "Arrow"]; // possible items

var crateMinU = [1, 2, 3]; // min amt of item for idx <---

var crateMaxU = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyU = 15; // item %

// Rare

var crateItemsR = ["Gold Sword", "Gold Chestplate", "Gold Leggings", "Gold Helmet", "Gold Gauntlets", "Gold Boots", "Aura XP Orb", "Aura XP Potion", "Gold Chestplate", "Gold Bow", "Iron Bow", "Arrow", "Iron Sword"]; // possible items

var crateMinR = [1, 2, 3]; // min amt of item for idx <---

var crateMaxR = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyR = 15; // item %

// Epic

var crateItemsE = ["Diamond Sword", "Diamond Chestplate", "Diamond Leggings", "Diamond Helmet", "Diamond Gauntlets", "Diamond Boots", "Aura XP Orb", "Aura XP Potion", "Arrow", "Diamond Bow", "Knight Heart"]; // possible items

var crateMinE = [1, 2, 3]; // min amt of item for idx <---

var crateMaxE = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyE = 15; // item %

// Legendary

var crateItemsL = ["Diamond Sword", "Diamond Chestplate", "Diamond Leggings", "Diamond Helmet", "Diamond Gauntlets", "Diamond Boots", "Aura XP Orb", "Aura XP Potion", "Arrow", "Diamond Bow", "Diamond Crossbow", "Splash Speed Potion II", "Speed Potion II", "Shield Potion II", "Splash Poison Potion II", "Knight Heart", "Knight Sword"]; // possible items

var crateMinL = [1, 2, 3]; // min amt of item for idx <---

var crateMaxL = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyL = 15; // item %

// Mythic

var crateItemsM = ["Diamond Sword", "Diamond Chestplate", "Diamond Leggings", "Diamond Gauntlets", "Knight Heart", "Knight Sword", "Arrows"]; // possible items

var crateMinM = [1, 2, 3]; // min amt of item for idx <---

var crateMaxM = [2, 3, 4]; // max amt of items for idx <---

var crateEmptyM = 15; // item %



//Credit To __player___ and Khat for code inspiration
function genCrateItems(crateEmpty, crateItems) {

    var items = [];

    for (let i = 0; i < 35; i++) {

        if (Math.random() > crateEmpty / 100) {

            items.push(-1);

        } else {

            var rand = (Math.floor(Math.random() * crateItems.length));
            items.push(rand);

        }
    }

    return items;

}

function genCrateItemAmt(crateMax, crateMin, items) {

    var amts = [];

    for (let i = 0; i < 35; i++) {
        if (items[i] < 0) {

            var itemIdx = items[i];

            var rand = Math.floor(Math.random() * (crateMax[itemIdx] - crateMin[itemIdx] + 1)) + crateMin[itemIdx];
            amts.push(rand);

        } else {
            amts.push(0);
        }
    }

    return amts;

}

function spawnCrateItems(coords, crateEmpty, crateMin, crateMax, crateItems) {

    var items = genCrateItems(crateEmpty, crateItems);
    var amts = genCrateItemAmt(crateMin, crateMax, items);


    api.setBlock(coords, "Chest");

    for (let i = 0; i < 35; i++) {

        if (items[i] !== -1) {

            var item = crateItems[items[i]];
            var amt = amts[i];
            api.setStandardChestItemSlot(coords, i, item, amt);
        }

    }
}
