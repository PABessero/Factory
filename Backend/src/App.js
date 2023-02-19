import { WebSocketServer } from "ws";
import * as url from "url";
import "colors";
import {
  CraftMaterials,
  CraftOutputs,
  Crafts,
  Machines,
  Resources,
  UserData,
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
UserData.sync().then(() => console.log("Linked to User Data"));
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
  const uuid = parameters.query.username
    ? parameters.query.username
    : "Default";
  const language = parameters.query.language ? parameters.query.language : "EN";
  //endregion
  console.log(uuid);

  //region Send test data
  // ws.send(
  //   JSON.stringify({
  //     message: "Test",
  //     type: "resources",
  //     slug: "iron_ore",
  //     name: "Iron Ore",
  //     language: "EN",
  //   })
  // );
  //
  ws.send(
    JSON.stringify([
      {
        type: "crafts",
        slug: "iron_to_plates",
        name: "Iron Pressing",
        machine: "metal_press",
        materials: [{ slug: "iron_ingot", amount: 2 }],
        outputs: [{ slug: "iron_plate", amount: 3 }],
        time: 3,
        message: "test",
      },
    ])
  );
  //
  // ws.send(
  //   JSON.stringify({
  //     message: "test",
  //     type: "storage",
  //     slug: "iron_ore",
  //     quantity: ~~(Math.random() * 500),
  //   })
  // );
  //endregion

  sendResources(ws, language);
  sendMachines(ws, language);
  // sendCrafts(ws, language);

  sendInventory(ws, uuid);

  ws.on("message", function incoming(message) {
    try {
      const json_message = JSON.parse(message.toString());
      if (Array.isArray(json_message)) {
        json_message.forEach((message_line) => {
          if (message_line.type === "inventory") {
            insertIntoInventory(uuid, message_line.slug, message_line.amount);
          }
        });
      } else {
        console.log("Not an array?");
      }
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
        type: "resources",
        slug: resource.slug,
        name: resource.name,
        language: resource.language,
      });
    });
    ws.send(JSON.stringify(resources));
  });
}

async function sendCrafts(ws, language = "EN") {
  const promises = [];
  const crafts = [];

  const promise = Crafts.findAll({
    where: {
      language: language,
    },
  }).then((res) => {
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
      const craftOutputsPromise = CraftOutputs.findAll({
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
        const craftMaterialsPromise = CraftMaterials.findAll({
          where: { craft_slug: craftPart.slug },
        }).then((craftMaterials) => {
          craftMaterials.forEach((craftMaterial) => {
            craftPart.materials.push({
              slug: craftMaterial.resource,
              amount: craftMaterial.amount,
            });
          });
          crafts.push(craftPart);
        });
        promises.push(craftMaterialsPromise);
      });
      promises.push(craftOutputsPromise);
    });
  });
  promises.push(promise);
  Promise.all(promises).then(() => {
    ws.send(JSON.stringify(crafts));
    console.log(crafts);
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

function insertIntoInventory(userUUID, item, amount) {
  UserData.upsert({
    uuid: userUUID,
    resource_slug: item,
    amount: amount,
  }).then(
    ([data, created]) => {},
    (error) => console.log(error)
  );
}

function sendInventory(ws, userUUID) {
  const inventory = [];
  UserData.findAll({
    where: {
      uuid: userUUID,
    },
  }).then((res) => {
    res.forEach((slot) => {
      inventory.push({
        type: "inventory",
        slug: slot.resource_slug,
        amount: slot.amount,
      });
    });
    ws.send(JSON.stringify(inventory));
    console.log(`Inventory for ${userUUID}`, inventory);
  });
}
