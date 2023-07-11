const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        category: {
            type: String,
            required: true,
            // type: mongoose.Schema.Types.ObjectId,
            // ref: "Category",
        },
        brand: {
            type: String,
            required: true,
            // enum: ["Old Navy", "Uniqlo", "H&M", "Zara"],
        },
        quantity: {
            type: Number,
            required: true,
        },
        sold: {
            type: Number,
            default: 0,
            // select: false, hide from the user
        },
        images: {
            type: Array,
        },
        color: {
            type: String,
            required: true,
            // enum: ["white", "yellow", "blue", "red"],
        },
        ratings: [
            {
                star: Number,
                comment: String,
                postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            },
        ],
        totalrating: {
            type: String,
            default: 0,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);