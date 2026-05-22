const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    fileUrl: {
        type: String,
        required: true
    },// stored in cloud (S3, Firebase, etc.)

    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "uploadedByModel"
    },

    uploadedByModel: {
        type: String,
        required: true,
        enum: ["Student", "Admin"]
    },

    uploadedByName: {
        type: String,
        required: true,
        trim: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    approvalStatus: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },

    rejectionReason: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

module.exports =
    mongoose.models.Material ||
    mongoose.model("Material", materialSchema);