import {
  CraftMaterials,
  CraftOutputs,
  Crafts,
  Machines,
  Resources,
} from "./DataBase.js";

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

export async function PopulateCrafts() {
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
}
