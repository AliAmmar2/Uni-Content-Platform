const mongoose = require("mongoose");

const AnnouncementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100000
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true
        },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "postedByModel"
        },

        postedByModel: {
            type: String,
            required: true,
            enum: ["Student", "Admin"]
        },
        postedByName: {
            type: String,
            required: true,
            trim: true
        },
        imagePath: String,
        imageMimeType: String,
        imageOriginalFilename: String
    },
    {timestamps: true}
);

AnnouncementSchema.index({course: 1, createdAt: -1});

module.exports = mongoose.model("Announcement", AnnouncementSchema);