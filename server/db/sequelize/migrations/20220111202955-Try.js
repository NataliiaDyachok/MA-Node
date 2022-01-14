
// eslint-disable-next-line import/no-extraneous-dependencies
const Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable => "item", deps: []
 * createTable => "type", deps: []
 * createTable => "product", deps: [item, type]
 * createTable => "user", deps: []
 * createTable => "order", deps: [user, product]
 * addIndex(item_title) => "item"
 * addIndex(type_title) => "type"
 * addIndex(user_nickname) => "user"
 *
 */

const info = {
  revision: 1,
  name: 'Try',
  created: '2022-01-10T19:28:36.117Z',
  comment: '',
};

const migrationCommands = (transaction) => [
  {
    fn: 'createTable',
    params: [
      'items',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        createdAt: { type: Sequelize.DATE, field: 'createdAt', allowNull: false, },
        updatedAt: { type: Sequelize.DATE, field: 'updatedAt', allowNull: false, },
        deletedAt: { type: Sequelize.DATE, field: 'deletedAt', allowNull: true, },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'types',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        createdAt: { type: Sequelize.DATE, field: 'createdAt', allowNull: false, },
        updatedAt: { type: Sequelize.DATE, field: 'updatedAt', allowNull: false, },
        deletedAt: { type: Sequelize.DATE, field: 'deletedAt', allowNull: true, },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'products',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
        },
        price: { type: Sequelize.DECIMAL(6, 2), field: 'price', allowNull: false, },
        quantity: { type: Sequelize.DECIMAL(6, 2), field: 'quantity', allowNull: false, },
        unit: { type: Sequelize.STRING, field: 'unit', allowNull: false, },
        createdAt: { type: Sequelize.DATE, field: 'createdAt', allowNull: false, },
        updatedAt: { type: Sequelize.DATE, field: 'updatedAt', allowNull: false, },
        deletedAt: { type: Sequelize.DATE, field: 'deletedAt', allowNull: true, },
        itemId: {
          type: Sequelize.UUID,
          field: 'itemId',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'items', key: 'id' },
          allowNull: true,
        },
        typeId: {
          type: Sequelize.UUID,
          field: 'typeId',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'types', key: 'id' },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'users',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
          allowNull: false,
        },
        firstName: { type: Sequelize.STRING, field: 'firstName', defaultValue: 'abc', allowNull: true, },
        lastName: { type: Sequelize.STRING, field: 'lastName', defaultValue: '', allowNull: false, },
        nickname: { type: Sequelize.STRING, field: 'nickname', defaultValue: '', allowNull: false, },
        birthDate: { type: Sequelize.DATEONLY, field: 'birthDate', allowNull: true, },
        lastLoginDt: { type: Sequelize.DATE, field: 'lastLoginDt', allowNull: true, },
        createdAt: { type: Sequelize.DATE, field: 'createdAt', allowNull: false, },
        updatedAt: { type: Sequelize.DATE, field: 'updatedAt', allowNull: false, },
        deletedAt: { type: Sequelize.DATE, field: 'deletedAt', allowNull: true, },
        email: { type: Sequelize.STRING, field: 'email', allowNull: true },
        password: { type: Sequelize.STRING, field: 'password', allowNull: false, },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'orders',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        userId: {
          type: Sequelize.UUID,
          field: 'userId',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'users', key: 'id' },
          allowNull: true,
        },
        productId: {
          type: Sequelize.UUID,
          field: 'productId',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'products', key: 'id' },
          allowNull: true,
        },
        createdAt: { type: Sequelize.DATE, field: 'createdAt', allowNull: false, },
        updatedAt: { type: Sequelize.DATE, field: 'updatedAt', allowNull: false, },
        deletedAt: { type: Sequelize.DATE, field: 'deletedAt', allowNull: true, },
      },
      { transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'types',
      ['title'],
      { indexName: 'type_title', name: 'type_title', transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'items',
      ['title'],
      { indexName: 'item_title', name: 'item_title', transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'users',
      ['nickname'],
      { indexName: 'user_nickname', name: 'user_nickname', transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: 'dropTable',
    params: ['orders', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['users', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['products', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['items', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['types', { transaction }],
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
          // eslint-disable-next-line no-plusplus
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (this.useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,

  up: async  (queryInterface, sequelize) => {
    // eslint-disable-next-line max-len
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    execute(queryInterface, sequelize, migrationCommands);
  },

  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};


// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */


//   },

//   down: async (queryInterface, Sequelize) => {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };
