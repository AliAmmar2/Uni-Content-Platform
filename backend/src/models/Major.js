const mongoose = require("mongoose");

const MajorSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    code: {type: String, required: true, unique: true},
    faculty: {type: mongoose.Schema.Types.ObjectId, ref: "Faculty", required: true},
    description: {type: String},
    totalCredits: {
        type: Number,
        default: 180
    },

    duration: {
        type: String,
        default: "3 Years (Bachelor)"
    }
}, {timestamps: true});

module.exports = mongoose.model("Major", MajorSchema);