const express = require("express");
const {
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
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getaProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/rating", authMiddleware, rating);
router.put("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);
router.get("/", authMiddleware, isAdmin, getAllProduct);
router.get("/", authMiddleware, isActive);
router.patch("/isArchive/:id", authMiddleware, isAdmin, isArchive);
router.patch("/activateProduct/:id", authMiddleware, isAdmin, activateProduct);






module.exports = router;