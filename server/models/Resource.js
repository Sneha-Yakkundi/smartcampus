const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Resource = sequelize.define("Resource", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    type: {
        type: DataTypes.STRING, // classroom, lab, projector, etc
        allowNull: false
    },

    location: {
        type: DataTypes.STRING,
        allowNull: false
    },

    building: {
        type: DataTypes.STRING,
        allowNull: true  // Building name for search/filter
    },

    floor: {
        type: DataTypes.INTEGER,
        allowNull: true  // Floor number for search/filter
    },

    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true  // Room capacity for search/filter and recommendations
    },

    department: {
        type: DataTypes.STRING,
        allowNull: true  // CSE, ECE, Mechanical for feature 6
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "available"  // available, under-maintenance
    },

    maintenanceNotes: {
        type: DataTypes.TEXT,
        allowNull: true  // Notes about maintenance
    }

});

module.exports = Resource;