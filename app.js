const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const productRouter = require("./routes/product.routes");
const categoryRouter = require("./routes/category.routes");
const subCategoryRouter = require("./routes/subCategory.routes.js");
const brandRouter = require("./routes/brand.routes.js");
const userRouter = require("./routes/user.routes.js");
const orderRouter = require("./routes/order.routes.js");
const AppError = require('./utils/appError.js');
const globalErrorHandler = require("./middlewares/globalErrorHandler");




const app = express();



app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());






app.use("/api/v1/product",productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subCategory", subCategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/order", orderRouter);



app.all('*', (req, res, next)=>{
    next(new AppError(`Invalid URL: ${req.originalUrl}`, 404))
})
app.use(globalErrorHandler)



module.exports = app;
