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
import { Populate_Machines, Populate_Resources } from "./Misc.js";

const wss = new WebSocketServer({ port: 4040 });
console.log("Creating server");

Resources.sync().then(() => console.log("Linked to Resources"));
Machines.sync().then(() => console.log("Linked to Machines"));
Crafts.sync().then(() => console.log("Linked to Crafts"));
CraftMaterials.sync().then(() => console.log("Linked to Craft Materials"));
CraftOutputs.sync().then(() => console.log("Linked to Craft Outputs"));

Populate_Resources().then(() => {
  console.log("Filled Resources");
  // Populate_Machines().then(() => {
  //   console.log("Filled Machines");
  // });
});

wss.on("connection", function connection(ws, req) {
  console.log("New Connection".green);
  const parameters = url.parse(req.url, true);

  // ws.send("Hello There!");

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
      console.log(resource.slug, resource.name);
    });
    ws.send(JSON.stringify(resources));
  });

  ws.send(
    JSON.stringify({
      message: "Test",
      type: "resource",
      slug: "iron_ore",
      name: "Iron Ore",
      language: "EN",
    })
  );

  ws.on("message", function incoming(message, isBinary) {
    console.log(message.toString());
    const test = message.toJSON();
    console.log(test);
  });

  ws.on("close", function disconnect() {
    console.log("Disconnected".red);
  });
});
