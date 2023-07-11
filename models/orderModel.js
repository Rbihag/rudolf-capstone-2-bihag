const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product", //reference to the Product model use .populate() to get the product details
                },
                count: Number,
                color: String,
            },
        ],
        paymentIntent: {},
        orderStatus: {
            type: String,
            default: "Order Verification",
            enum: [
                "Order Verification",
                "Cash on Delivery",
                "Processing",
                "Dispatched",
                "Cancelled",
                "Delivered",
            ],
        },
        orderby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);