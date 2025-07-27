// models/BloodComponents.js
module.exports = (sequelize, DataTypes) => {
    const BloodComponents = sequelize.define('BloodComponents', {
      IDBloodComponent: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'BloodComponents',
      timestamps: false
    });
  
    return BloodComponents;
  };
  