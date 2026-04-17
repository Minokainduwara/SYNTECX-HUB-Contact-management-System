import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    userId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone:{
        type: String,
    },
    tags: [String],
    isFavourite:{
        type: Boolean,
        default: false,
    },
    isPinned:{
        type: Boolean,
        default: false,
    }

}, { timestamps: true });

export default mongoose.model("Contact", contactSchema);