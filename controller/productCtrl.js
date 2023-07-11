const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");


// create product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    }
    catch (error) {
        throw new Error(error);
    }
});

const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        throw new Error(error);
    }
});


// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id; // Extract the id from req.params
    validateMongoDbId(id);
    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: id }); // Pass the filter as an object
        res.json(deletedProduct);
    } catch (error) {
        throw new Error(error);
    }
});


// get a product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const findProduct = await Product.findById(id).select('-__v'); //exclude __v from the response
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
});

// get all product
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        const getallProducts = await Product.find(req.query).select('-__v'); //exclude __v from the response
        res.json(getallProducts);
    } catch (error) {
        throw new Error(error);
    }
});


// get all active product
const isActive = asyncHandler(async (req, res) => {
    // console.log(req.query) check the query
    try {
        const isActive = await Product.find(req.query).select('-__v'); //exclude __v from the response
        res.json(isActive);
    } catch (error) {
        throw new Error(error);
    }
});


// archive product
const isArchive = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const isArchive = await Product.findOneAndUpdate(
            { _id: id },
            { isActive: false },
            { new: true }
        );
        res.json(isArchive);
    } catch (error) {
        throw new Error(error);
    }
});


// activate product
const activateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const isArchive = await Product.findOneAndUpdate(
            { _id: id },
            { isActive: true },
            { new: true }
        );
        res.json(isArchive);
    } catch (error) {
        throw new Error(error);
    }
});


// add to or remove from wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(
                _id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
});


// product rating
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        );
        if (alreadyRated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated },
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment },
                },
                {
                    new: true,
                }
            );
        } else {
            const rateProduct = await Product.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id,
                        },
                    },
                },
                {
                    new: true,
                }
            );
        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalproduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            { new: true }
        );
        res.json(finalproduct);
    } catch (error) {
        throw new Error(error);
    }
});
















module.exports = {
    createProduct,
    getaProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    isActive,
    isArchive,
    activateProduct,
    addToWishlist,
    rating,
};