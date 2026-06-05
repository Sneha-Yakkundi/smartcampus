const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    role: {
        type: DataTypes.STRING,
        defaultValue: "student"  // student, faculty, admin
    },

    department: {
        type: DataTypes.STRING,
        allowNull: true  // CSE, ECE, Mechanical for feature 6
    }

});

module.exports = User;