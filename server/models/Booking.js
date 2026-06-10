const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    resourceId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },

    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "pending"  // pending, approved, rejected, completed, cancelled
    },

    approvalStatus: {
        type: DataTypes.STRING,
        defaultValue: "pending"  // pending, approved, rejected - for feature 5
    },

    priority: {
        type: DataTypes.INTEGER,
        defaultValue: 1  // 1 = student (default), 2 = faculty (higher priority) - for feature 7
    },

   
    adminNotes: {
        type: DataTypes.TEXT,
        allowNull: true  // Admin notes for approval/rejection
    }

});

module.exports = Booking;