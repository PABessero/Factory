// noinspection JSVoidFunctionReturnValueUsed

import { WebSocketServer } from "ws";
import * as url from "url";
import "colors";
import {
  CraftMaterials,
  CraftOutputs,
  Crafts,
  Machines,
  Resources,
} from "./DataBase.js";
import {
  Populate_Machines,
  Populate_Resources,
  Populate_Crafts,
} from "./Misc.js";

const wss = new WebSocketServer({ port: 4040 });
console.log("Creating server");

//region Create DB
Resources.sync().then(() => console.log("Linked to Resources"));
Machines.sync().then(() => console.log("Linked to Machines"));
Crafts.sync().then(() => console.log("Linked to Crafts"));
CraftMaterials.sync().then(() => console.log("Linked to Craft Materials"));
CraftOutputs.sync().then(() => console.log("Linked to Craft Outputs"));
//endregion

//region Fill DB
Populate_Resources().then(() => {
  console.log("Filled Resources");
  Populate_Machines().then(() => {
    console.log("Filled Machines");
    Populate_Crafts().then(() => {
      console.log("Filled Crafts");
    });
  });
});
//endregion

wss.on("connection", function connection(ws, req) {
  console.log("New Connection".green);
  //region Get URL parameters
  const parameters = url.parse(req.url, true);
  const username = parameters.query.username
    ? parameters.query.username
    : "Default";
  const language = parameters.query.language ? parameters.query.language : "EN";
  //endregion
  console.log(username);

  //region Send test data
  ws.send(
    JSON.stringify({
      message: "Test",
      type: "resource",
      slug: "iron_ore",
      name: "Iron Ore",
      language: "EN",
    })
  );

  ws.send(
    JSON.stringify({
      type: "craft",
      slug: "iron_to_plates",
      machine: "metal_press",
      materials: [{ slug: "iron_ingot", amount: 2 }],
      outputs: [{ slug: "iron_plate", amount: 3 }],
      time: 3,
      message: "test",
    })
  );

  ws.send(
    JSON.stringify({
      message: "test",
      type: "storage",
      slug: "iron_ore",
      quantity: ~~(Math.random() * 500),
    })
  );
  //endregion

  sendResources(ws, language);
  sendMachines(ws, language);
  sendCrafts(ws, language);

  ws.on("message", function incoming(message) {
    try {
      const json_message = JSON.parse(message.toString());
      console.log(json_message);
    } catch (e) {
      ws.send("Error in message: " + message.toString());
      ws.send(e.message);
      console.log(e.message.toString().red);
      console.log(message.toString().red);
    }
  });

  ws.on("close", function disconnect() {
    console.log("Disconnected".red);
  });
});

function sendResources(ws, language = "EN") {
  Resources.findAll({
    where: {
      language: "EN",
    },
  }).then((res) => {
    const resources = [];
    res.forEach((resource) => {
      resources.push({
        type: "resource",
        slug: resource.slug,
        name: resource.name,
        language: resource.language,
      });
    });
    ws.send(JSON.stringify(resources));
  });
}

function sendCrafts(ws, language = "EN") {
  Crafts.findAll({
    where: {
      language: language,
    },
  }).then((res) => {
    const crafts = [];
    res.forEach((craft) => {
      const craftPart = {
        type: "crafts",
        slug: craft.slug,
        name: craft.name,
        machine: craft.machine,
        materials: [],
        outputs: [],
        time: craft.time,
      };

      CraftOutputs.findAll({
        where: {
          craft_slug: craftPart.slug,
        },
      }).then((craftOutputs) => {
        craftOutputs.forEach((craftOutput) => {
          craftPart.outputs.push({
            slug: craftOutput.resource,
            amount: craftOutput.amount,
          });
        });
        CraftMaterials.findAll({ where: { craft_slug: craftPart.slug } }).then(
          (craftMaterials) => {
            craftMaterials.forEach((craftMaterial) => {
              craftPart.materials.push({
                slug: craftMaterial.resource,
                amount: craftMaterial.amount,
              });
            });
            crafts.push(craftMaterials);
          }
        );
      });
    });
    ws.send(JSON.stringify(crafts));
  });
}

function sendMachines(ws, language = "EN") {
  Machines.findAll({
    where: {
      language: "EN",
    },
  }).then((res) => {
    const machines = [];
    res.forEach((machine) => {
      machines.push({
        type: "machines",
        slug: machine.slug,
        name: machine.name,
        language: machine.language,
      });
    });
    ws.send(JSON.stringify(machines));
  });
}
