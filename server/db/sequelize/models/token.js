/* eslint-disable max-len */
module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define( 'token', {
    // eslint-disable-next-line max-len
    id: {  type: DataTypes.UUID
      , defaultValue: sequelize.Sequelize.literal('uuid_generate_v4()')
      , primaryKey: true
      , allowNull: false
      , field: 'id', },
    token: { type: DataTypes.STRING, allowNull: false },
    // expiryDate: { type: DataTypes.DATE, allowNull: false, defaultValue: null, },
    deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null, },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Date.now(), }
    },
    {
      timestamps: false,
      underscored: false,
      tableName: 'token',
      indexes: [
        { fields: ['title'] },
      ],
    },
  );

  Model.associate = (models) => {
    Model.belongsTo(models.user);
  };

  return Model;
};
