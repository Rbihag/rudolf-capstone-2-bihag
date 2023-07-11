const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express()
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const couponRouter = require("./routes/couponRoute");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");


dbConnect();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// http://localhost:5000/api/user
app.use("/api/user", authRouter);
// http://localhost:5000/api/product
app.use("/api/product", productRouter);
// http://localhost:5000/api/coupon
app.use("/api/coupon", couponRouter);



app.use(notFound);
app.use(errorHandler);









app.listen(PORT, () => {
    console.log(`Connection Established`);
    setTimeout(() => {
        console.log(`\x1b[93m Welcome back Sir, J.A.R.V.I.S. now ONLINE at port ${PORT}. \x1b[0m`);
    }, 1000); // Delay of 1000 milliseconds (1 seconds)
})

