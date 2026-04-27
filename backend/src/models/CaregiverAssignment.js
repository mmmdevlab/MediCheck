const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CaregiverAssignment = sequelize.define(
  "CaregiverAssignment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    caregiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    relationshipType: {
      type: DataTypes.ENUM("family", "friend", "professional"),
      allowNull: false,
      defaultValue: "family",
    },
    access_level: {
      type: DataTypes.ENUM("full", "limited"),
      allowNull: false,
      defaultValue: "full",
    },
    granted_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "caregiver_assignments",
    timestamps: true,
    underscored: true,
  },
);

module.exports = CaregiverAssignment;
