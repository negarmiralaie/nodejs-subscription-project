const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Customers", deps: []
 * createTable() => "Subscriptions", deps: [Customers]
 * createTable() => "Invoices", deps: [Subscriptions]
 *
 */

const info = {
  revision: 1,
  name: "migrationNo1",
  created: "2023-02-12T05:40:08.756Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Customers",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          type: Sequelize.STRING,
          field: "username",
          allowNull: false,
        },
        creadit: { type: Sequelize.STRING, field: "creadit", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Subscriptions",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        price: { type: Sequelize.FLOAT, field: "price", allowNull: false },
        isActive: {
          type: Sequelize.BOOLEAN,
          field: "isActive",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        customer_id: {
          type: Sequelize.INTEGER,
          field: "customer_id",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Customers", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Invoices",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        price: { type: Sequelize.FLOAT, field: "price", allowNull: false },
        isActive: {
          type: Sequelize.BOOLEAN,
          field: "isActive",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        subscription_id: {
          type: Sequelize.INTEGER,
          field: "subscription_id",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Subscriptions", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Customers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Invoices", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Subscriptions", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
