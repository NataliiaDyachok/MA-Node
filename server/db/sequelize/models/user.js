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
      first_name: { type: DataTypes.STRING, allowNull: false, defaultValue: 'abc', field: 'first-name' },
      last_name: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
      // nickname: { type: STRING, allowNull: false, defaultValue: '' },
      gender: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['male', 'female', 'unknown'],
        defaultValue: 'unknown',
      },
      birth_date: { type: DataTypes.DATEONLY, allowNull: true },
      last_login_dt: { type: DataTypes.DATE, allowNull: true },
      created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: Date.now() },
      email: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      is_blocked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      // city_id -> city.id
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'users',
      indexes: [
        // { fields: ['nickname'] },
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
