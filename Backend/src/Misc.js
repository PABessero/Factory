import {
  CraftMaterials,
  CraftOutputs,
  Crafts,
  Machines,
  Resources,
} from "./DataBase.js";

//region Init DB

export async function Populate_Resources() {
  //region Iron
  try {
    await Resources.create({
      slug: "iron_ore",
      language: "EN",
      name: "Iron Ore",
    });
  } catch (e) {}
  try {
    await Resources.create({
      slug: "molten_iron",
      language: "EN",
      name: "Molten Iron",
    });
  } catch (e) {}
  try {
    await Resources.create({
      slug: "iron_ingot",
      language: "EN",
      name: "Iron Ingot",
    });
  } catch (e) {}

  try {
    await Resources.create({
      slug: "iron_plate",
      language: "EN",
      name: "Iron Plate",
    });
  } catch (e) {}

  try {
    await Resources.create({
      slug: "iron_rod",
      language: "EN",
      name: "Iron Rod",
    });
  } catch (e) {}
  //endregion

  //region Copper
  try {
    await Resources.create({
      slug: "copper_ore",
      language: "EN",
      name: "Copper Ore",
    });
  } catch (e) {}
  //endregion

  //region Pabmium
  try {
    await Resources.create({
      slug: "pabmium_ore",
      language: "EN",
      name: "Pabmium Ore",
    });
  } catch (e) {}
  //endregion

  //region Stone
  try {
    await Resources.create({
      slug: "stone",
      language: "EN",
      name: "Stone",
    });
  } catch (e) {}
  //endregion

  //region Wood
  try {
    await Resources.create({
      slug: "wood",
      language: "EN",
      name: "Wood",
    });
  } catch (e) {}
  //endregion

  //region Sand
  try {
    await Resources.create({
      slug: "sand",
      language: "EN",
      name: "Sand",
    });
  } catch (e) {}
  try {
    await Resources.create({
      slug: "glass",
      language: "EN",
      name: "Glass",
    });
  } catch (e) {}
  //endregion
}

export async function Populate_Machines() {
  try {
    await Machines.create({
      slug: "furnace",
      language: "EN",
      name: "Furnace",
    });
  } catch (e) {}

  try {
    await Machines.create({
      slug: "smelter",
      language: "EN",
      name: "Smelter",
    });
  } catch (e) {}

  try {
    await Machines.create({
      slug: "ingot_cast",
      language: "EN",
      name: "Ingot Cast",
    });
  } catch (e) {}

  try {
    await Machines.create({
      slug: "metal_press",
      language: "EN",
      name: "Metal Press",
    });
  } catch (e) {}
}

export async function Populate_Crafts() {
  //region Iron Plates craft
  try {
    await Crafts.create({
      slug: "iron_pressing",
      machine: "metal_press",
      name: "Iron Pressing",
      language: "EN",
      time: 3,
    });
  } catch (e) {}

  try {
    await CraftOutputs.create({
      craft_slug: "iron_pressing",
      resource: "iron_plate",
      amount: 3,
    });
  } catch (e) {}

  try {
    await CraftMaterials.create({
      craft_slug: "iron_pressing",
      resource: "iron_ingot",
      amount: 2,
    });
  } catch (e) {}
  //endregion

  try {
    await Crafts.create({
      slug: "iron_plate_cutting",
      machine: "metal_press",
      language: "en",
      name: "Iron Plate Cutting",
      time: 2,
    });
  } catch (e) {}
}

//endregion

async function getCrafts(language = "EN") {
  return Crafts.findAll({
    where: { language: language },
  }).then(
    (res) => {
      const crafts = [];
      res.forEach(
        (craft) =>
          async function (craft) {
            crafts.push({
              type: "crafts",
              slug: craft.slug,
              name: craft.name,
              machine: craft.machine,
              materials: await getCraftInputs(),
            });
          }
      );
    },
    () => {
      return [];
    }
  );
}

async function getCraftInputs(craft) {}

async function getCraftOutput(craft) {}
