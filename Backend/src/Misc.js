import { Machines, Resources } from "./DataBase.js";

export async function Populate_Resources() {
  //region Iron
  try {
    await Resources.create({
      slug: "iron_ore",
      language: "EN",
      name: "Iron Ore",
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await Resources.create({
      slug: "molten_iron",
      language: "EN",
      name: "Molten Iron",
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await Resources.create({
      slug: "iron_ingot",
      language: "EN",
      name: "Iron Ingot",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion

  //region Copper
  try {
    await Resources.create({
      slug: "copper_ore",
      language: "EN",
      name: "Copper Ore",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion

  //region Pabmium
  try {
    await Resources.create({
      slug: "pabmium_ore",
      language: "EN",
      name: "Pabmium Ore",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion

  //region Stone
  try {
    await Resources.create({
      slug: "stone",
      language: "EN",
      name: "Stone",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion

  //region Wood
  try {
    await Resources.create({
      slug: "wood",
      language: "EN",
      name: "Wood",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion

  //region Sand
  try {
    await Resources.create({
      slug: "sand",
      language: "EN",
      name: "Sand",
    });
  } catch (e) {
    console.log(e.message);
  }
  try {
    await Resources.create({
      slug: "glass",
      language: "EN",
      name: "Glass",
    });
  } catch (e) {
    console.log(e.message);
  }
  //endregion
}

export async function Populate_Machines() {
  await Machines.create({
    slug: "furnace",
    language: "EN",
    name: "Furnace",
  });
  await Machines.create({
    slug: "smelter",
    language: "EN",
    name: "Smelter",
  });
  await Machines.create({
    slug: "ingot_cast",
    language: "EN",
    name: "Ingot Cast",
  });
  await Machines.create({
    slug: "metal_press",
    language: "EN",
    name: "Metal Press",
  });
}
