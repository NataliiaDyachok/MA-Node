module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define( 'type', {
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
      tableName: 'types',
      indexes: [
        { fields: ['title'] },
      ],
    },
  );

  Model.associate = (models) => {
    // Model.belongsTo(models.city);
    // Model.hasMany(models.team, { foreignKey: { allowNull: false } })
    Model.belongsTo(models.product);
  };

  return Model;
};
