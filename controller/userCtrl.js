const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const uniqid = require("uniqid");

const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");



// create a new user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // user already exists
        throw new Error("User Already Exists");
    }
});


// login user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateuser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});


// admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check if user exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Unauthorized Login");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id);
        const updateuser = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id),
        });
    } else {
        throw new Error("Invalid Credentials");
    }
});


// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    // console.log(refreshToken);
    const user = await User.findOne({ refreshToken });
    // res.json(user);
    if (!user) throw new Error(" No Refresh token found");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("Something wrong with refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({ accessToken });
    });
});


// logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    /* 
    await User.findOneAndUpdate(refreshToken, { 
        refreshToken: "",
    });
    */
    await User.findOneAndUpdate({ refreshToken: refreshToken }, {
        refreshToken: "",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
});


// Update a user
const updatedUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                firstName: req?.body?.firstName,
                lastName: req?.body?.lastName,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
            }, {
            new: true,
        });
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});

// set a user as admin
const setAdmin = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const setAdmin = await User.findByIdAndUpdate(
            id,
            {
                role: "admin",
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User is now an Admin",
        });
    } catch (error) {
        throw new Error(error);
    }
});


// save user address
const saveAddress = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                address: req?.body?.address,
            },
            {
                new: true,
            }
        );
        res.json(updatedUser);
    } catch (error) {
        throw new Error(error);
    }
});



// get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find().populate("wishlist");
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});


// get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const getaUser = await User.findById(id);
        res.json({
            getaUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});


// delete a user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteaUser = await User.findByIdAndDelete(id);
        res.json({
            deleteaUser,
        });
    } catch (error) {
        throw new Error(error)
    }
});


// block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User Blocked"
        });
    } catch (error) {
        throw new Error(error);
    }
});


//   unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false,
            },
            {
                new: true,
            }
        );
        res.json({
            message: "User UnBlocked",
        });
    } catch (error) {
        throw new Error(error);
    }
});

// update,forgot,reset password functionality
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatedPassword = await user.save();
        res.json(updatedPassword);
    } else {
        res.json(user);
    }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not recognized with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Sir, please click on the Reset URL within the next 10 minutes, and allow me, your trusty companion J.A.R.V.I.S. to retrieve your password! <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
        const data = {
            to: email,
            text: "Sir, please click on the Reset URL within the next 10 minutes, and allow me, your trusty companion J.A.R.V.I.S. to retrieve your password!",
            subject: "Forgot Password Link",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
    } catch (error) {
        throw new Error(error);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
});



// get wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const findUser = await User.findById(_id).populate("wishlist"); //.populate is used to get all data of the product into the wishlist
        res.json(findUser);
    } catch (error) {
        throw new Error(error);
    }
});

// cart functionality
const userCart = asyncHandler(async (req, res) => {
    const { cart } = req.body;
    const { _id } = req.user;

    try {
        const user = await User.findById(_id);

        // check if user already has a cart
        const alreadyExistCart = await Cart.findOne({ orderby: user._id });
        if (alreadyExistCart) {
            await Cart.deleteOne({ _id: alreadyExistCart._id });
        }


        // Check if cart exists and has items
        if (Array.isArray(cart) && cart.length > 0) {
            let products = [];

            for (let i = 0; i < cart.length; i++) {
                let object = {};
                object.product = cart[i]._id;
                object.count = cart[i].count;
                object.color = cart[i].color;
                let getPrice = await Product.findById(cart[i]._id).select("price").exec();
                object.price = getPrice.price;
                products.push(object);
            }
            // total price of the cart
            let cartTotal = 0;
            for (let i = 0; i < products.length; i++) {
                cartTotal = cartTotal + products[i].price * products[i].count;
            }

            let newCart = await new Cart({
                products,
                cartTotal,
                orderby: user?._id,
            }).save();

            res.json(newCart);
        } else {
            res.status(400).json({ error: 'Cart is empty or not provided' });
        }
    } catch (error) {
        throw new Error(error);
    }
});


const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        // populate the products in the cart schema of the user
        const cart = await Cart.findOne({ orderby: _id }).populate(
            "products.product"
        );
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});


const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});


const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");
    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    await Cart.findOneAndUpdate(
        { orderby: user._id },
        { totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
});


// order functionality
const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    try {
        if (!COD) throw new Error("Create order failed");
        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(), //uniqid is a package that generates unique id
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "PhP",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();
        let update = userCart.products.map((item) => { //increase sold quantity and decrease quantity
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Product.bulkWrite(update, {}); //bulkwrite is a mongoose method that allows us to update multiple documents at once
        res.json({ message: "Order Placed Successfully!" });
    } catch (error) {
        throw new Error(error);
    }
});


const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const userorders = await Order.findOne({ orderby: _id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});


const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});


const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const userorders = await Order.findOne({ orderby: id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            { new: true }
        );
        res.json(updateOrderStatus);
    } catch (error) {
        throw new Error(error);
    }
});





module.exports = {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    setAdmin,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderByUserId,
};