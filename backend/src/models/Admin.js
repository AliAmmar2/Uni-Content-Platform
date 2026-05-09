    const mongoose = require("mongoose");

    const AdminSchema = new mongoose.Schema({

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["admin", "super_admin"],
            default: "admin"
        },

        fullName: {
            type: String,
            required: true
        },

        passwordHash: {
            type: String,
            required: true
        },

        lastLogin: Date,

        loginAttempts: {
            type: Number,
            default: 0
        }

    }, {
        timestamps: true
    });

    module.exports = mongoose.model("Admin", AdminSchema);