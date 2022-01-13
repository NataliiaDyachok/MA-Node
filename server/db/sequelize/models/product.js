/* eslint-disable max-len */
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define( 'product', {
    id: { type: DataTypes.UUID
      , defaultValue: sequelize.Sequelize.literal('uuid_generate_v4()')
      , primaryKey: true
      , allowNull: false
      , field: 'id', },
    // item: { type: DataTypes.STRING, allowNull: false, },
    // type: { type: DataTypes.STRING, allowNull: false, },
    unit: { type: DataTypes.STRING, allowNull: false, },
    price: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0.0, },
    quantity: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 1.0, },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, }
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'products',
    },
  );

  Model.associate = (models) => {
    // Model.belongsTo(models.city);
    // Model.hasMany(models.team, { foreignKey: { allowNull: false } })
    //  belongsToMany

    Model.belongsTo(models.item, { foreignKey: { allowNull: false } });
    Model.belongsTo(models.type, { foreignKey: { allowNull: false } });
    // Model.belongsToMany(models.order, { foreignKey: { allowNull: false } });
  };

  return Model;
};
