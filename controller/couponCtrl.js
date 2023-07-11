const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");


// create coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
});


// get all coupons
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        throw new Error(error);
    }
});



// update coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatecoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatecoupon);
    } catch (error) {
        throw new Error(error);
    }
});


// delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    } catch (error) {
        throw new Error(error);
    }
});


// get a coupon
const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getAcoupon = await Coupon.findById(id);
        res.json(getAcoupon);
    } catch (error) {
        throw new Error(error);
    }
});






module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getCoupon,
};