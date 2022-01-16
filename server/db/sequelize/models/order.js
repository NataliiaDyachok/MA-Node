module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define( 'order', {
    // eslint-disable-next-line max-len
    id: {  type: DataTypes.UUID
      , defaultValue: sequelize.Sequelize.literal('uuid_generate_v4()')
      , primaryKey: true
      , allowNull: false
      , field: 'id', },
    title: { type: DataTypes.STRING, allowNull: false },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, }
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'orders',
      indexes: [
        { fields: ['title'] },
      ],
    },
  );

  Model.associate = (models) => {
    // Model.belongsTo(models.city);
    // Model.hasMany(models.team, { foreignKey: { allowNull: false } })
    Model.belongsTo(models.user);
    Model.belongsTo(models.product);
    // Model.hasMany(models.product, { foreignKey: { allowNull: false } });
  };

  return Model;
};
