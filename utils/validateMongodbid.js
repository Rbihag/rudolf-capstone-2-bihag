// To ensure only valid MongoDB IDs are being used in the application and handle cases where an invalid id is passed.

const mongoose = require("mongoose");
const validateMongoDbId = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("ID is not valid or not Found");
};

module.exports = validateMongoDbId;