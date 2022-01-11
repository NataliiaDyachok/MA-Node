
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
      'item',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'type',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'product',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(6, 2),
          field: 'price',
          allowNull: false,
        },
        quantity: {
          type: Sequelize.DECIMAL(6, 2),
          field: 'quantity',
          allowNull: false,
        },
        unit: {
          type: Sequelize.STRING,
          field: 'unit',
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'createdAt',
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updatedAt',
          allowNull: false,
        },
        item_id: {
          type: Sequelize.UUID,
          field: 'item_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'item', key: 'id' },
          allowNull: true,
        },
        type_id: {
          type: Sequelize.UUID,
          field: 'type_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'type', key: 'id' },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'user',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        first_name: {
          type: Sequelize.STRING,
          field: 'first-name',
          defaultValue: 'abc',
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING,
          field: 'last_name',
          defaultValue: '',
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING,
          field: 'nickname',
          defaultValue: '',
          allowNull: false,
        },
        gender: {
          type: Sequelize.ENUM('male', 'female', 'unknown'),
          field: 'gender',
          defaultValue: 'unknown',
          allowNull: false,
        },
        birth_date: {
          type: Sequelize.DATEONLY,
          field: 'birth_date',
          allowNull: true,
        },
        last_login_dt: {
          type: Sequelize.DATE,
          field: 'last_login_dt',
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW,
          allowNull: true,
        },
        email: { type: Sequelize.STRING, field: 'email', allowNull: false },
        password: {
          type: Sequelize.STRING,
          field: 'password',
          allowNull: false,
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          field: 'is_deleted',
          defaultValue: false,
          allowNull: false,
        },
        is_blocked: {
          type: Sequelize.BOOLEAN,
          field: 'is_blocked',
          defaultValue: false,
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'createTable',
    params: [
      'order',
      {
        id: {
          type: Sequelize.UUID,
          field: 'id',
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: 'title', allowNull: false },
        user_id: {
          type: Sequelize.UUID,
          field: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'user', key: 'id' },
          allowNull: true,
        },
        product_id: {
          type: Sequelize.UUID,
          field: 'product_id',
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          references: { model: 'product', key: 'id' },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'type',
      ['title'],
      { indexName: 'type_title', name: 'type_title', transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'item',
      ['title'],
      { indexName: 'item_title', name: 'item_title', transaction },
    ],
  },
  {
    fn: 'addIndex',
    params: [
      'user',
      ['nickname'],
      { indexName: 'user_nickname', name: 'user_nickname', transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: 'dropTable',
    params: ['item', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['type', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['product', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['user', { transaction }],
  },
  {
    fn: 'dropTable',
    params: ['order', { transaction }],
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

  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),

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
