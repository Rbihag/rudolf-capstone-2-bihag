const express = require("express");
const {
    createUser,
    loginUserCtrl,
    getallUser,
    getaUser,
    setAdmin,
    deleteaUser,
    updatedUser,
    saveAddress,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    userCart, //Add to cart
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllOrders,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();



router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);

router.put("/password", authMiddleware, updatePassword);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);
router.post("/cart", authMiddleware, userCart);  //Add to cart
router.post("/cart/applycoupon", authMiddleware, applyCoupon);
router.post("/cart/cash-order", authMiddleware, createOrder);
router.get("/all-users", getallUser);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.post("/getorderbyuser/:id", authMiddleware, isAdmin, getAllOrders);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete("/:id", deleteaUser);
router.put(
    "/order/update-order/:id",
    authMiddleware,
    isAdmin,
    updateOrderStatus
);
router.put("/edit-user", authMiddleware, updatedUser);
router.put("/save-address", authMiddleware, saveAddress);
router.patch("/edit-user/:id", authMiddleware, isAdmin, setAdmin);

router.put("/block-user/:id", authMiddleware, isAdmin, blockUser);
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser);







module.exports = router;