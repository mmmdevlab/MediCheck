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
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "patient_id",
    },
    caregiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "caregiver_id",
    },
    relationshipType: {
      type: DataTypes.ENUM("family", "friend", "professional"),
      allowNull: false,
      defaultValue: "family",
      field: "relationship_type",
    },
    accessLevel: {
      type: DataTypes.ENUM("full", "limited"),
      allowNull: false,
      defaultValue: "full",
      field: "access_level",
    },
    grantedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "granted_at",
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "revoked_at",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
  },
  {
    tableName: "caregiver_assignments",
    timestamps: true,
    underscored: true,
  },
);

module.exports = CaregiverAssignment;
