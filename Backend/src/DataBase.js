import * as Sequelize from "sequelize";

export const sequelize = new Sequelize.Sequelize(
  "database",
  "user",
  "password",
  {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    // For SQLite Only
    storage: "database.sqlite",
  }
);

export const Users = sequelize.define("users", {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  username: Sequelize.STRING,
});

export const Resources = sequelize.define("resources", {
  slug: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  language: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  name: Sequelize.STRING,
});

export const Machines = sequelize.define("machines", {
  slug: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  language: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: "EN",
  },
  name: Sequelize.STRING,
});

export const Crafts = sequelize.define("crafts", {
  slug: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  language: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: "EN",
  },
  name: Sequelize.STRING,
  machine: Sequelize.STRING,
  time: Sequelize.NUMBER,
});

export const CraftMaterials = sequelize.define("craft_materials", {
  craft_slug: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  resource: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  amount: Sequelize.NUMBER,
});

export const CraftOutputs = sequelize.define("craft_outputs", {
  craft_slug: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  resource: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  amount: Sequelize.NUMBER,
});
