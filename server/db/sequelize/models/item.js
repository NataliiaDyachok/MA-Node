/* eslint-disable max-len */
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define( 'item', {
    // eslint-disable-next-line max-len
    id: {  type: DataTypes.UUID
      , defaultValue: sequelize.Sequelize.literal('uuid_generate_v4()')
      , primaryKey: true
      , allowNull: false
      , field: 'id', },
    title: { type: DataTypes.STRING, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), }
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'items',
      indexes: [
        { fields: ['title'] },
      ],
    },
  );

  Model.associate = (models) => {
    // Model.belongsTo(models.city);
    Model.hasMany(models.product, { foreignKey: { allowNull: false } });
    // Model.belongsTo(models.product);
  };

  return Model;
};
