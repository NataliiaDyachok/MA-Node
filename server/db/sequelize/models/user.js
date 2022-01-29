/* eslint-disable max-len */
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID
        , defaultValue: sequelize.Sequelize.literal('uuid_generate_v4()')
        , primaryKey: true
        , allowNull: false
        , field: 'id',
      },
      firstName: { type: DataTypes.STRING, allowNull: false, defaultValue: 'abc' },
      lastName: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
      nickname: { type: DataTypes.STRING, allowNull: true, defaultValue: '' },
      birthDate: { type: DataTypes.DATEONLY, allowNull: true },
      lastLoginDt: { type: DataTypes.DATE, allowNull: true },
      deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      // is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      // is_blocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'users',
      indexes: [
        { fields: ['nickname'] },
        // { fields: ['display'] },
      ],
    },
  );

  Model.associate = (models) => {
    // Model.belongsTo(models.city);
    // Model.hasMany(models.team, { foreignKey: { allowNull: false } })
    // Model.hasMany(models.order, { foreignKey: { allowNull: false } });
    Model.belongsToMany(models.product, {through: models.order});
  };

  return Model;
};
