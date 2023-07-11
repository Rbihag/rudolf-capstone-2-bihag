const { default: mongoose } = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log(`\x1b[31m Initializing J.A.R.V.I.S. \x1b[0m`);
    }
    catch (error) {
        console.log("Connection Failed")
    }
};

module.exports = dbConnect;