
//Packages
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const hpp = require('hpp');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const nocache = require("nocache");
//-------------------------------------------------------------------------------//



// Import Files
const AppError = require('./utils/appError.js');
const salesRouter = require("./routes/sales.routes");
const programRouter = require("./routes/program.routes");
const specializationRouter = require("./routes/specialization.routes.js");
const slotRouter = require("./routes/slot.routes.js");
const userRouter = require("./routes/user.routes.js");
const companyRouter = require("./routes/company.routes.js");
const trashRouter = require("./routes/trash.routes.js");
const loginFailedRouter = require("./routes/loginFailed.routes");
const studentRouter = require("./routes/student.routes.js");
const intakeRouter = require("./routes/intake.routes.js");
const admissionStatusRouter = require("./routes/admissionStatus.routes.js");
const instructorRouter = require("./routes/instructor.routes.js");
const authRouter = require("./routes/auth.routes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
//-------------------------------------------------------------------------------//

const app = express();




// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname,'./uploads')));
app.use(express.json({limit:'20kb'}));
app.use(express.urlencoded({ extended: true }));
// To remove data using these defaults:
app.use(nocache());
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
//-------------------------------------------------------------------------------//




// Routes
app.use("/api/v1/specialization", specializationRouter);
app.use("/api/v1/program", programRouter);
app.use("/api/v1/slot", slotRouter);
app.use("/api/v1/intake", intakeRouter);
app.use("/api/v1/sales",salesRouter);
app.use("/api/v1/student",studentRouter);
app.use("/api/v1/trash",trashRouter);
app.use("/api/v1/loginFailed",loginFailedRouter);
app.use("/api/v1/company",companyRouter);
app.use("/api/v1/instructor",instructorRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admissionStatus", admissionStatusRouter);
app.use('/api/v1/auth', authRouter);
//-------------------------------------------------------------------------------//




// Route for any url not matching
app.all('*', (req, res, next)=>{
    next(new AppError(`Invalid URL: ${req.originalUrl}`, 404))
})
//-------------------------------------------------------------------------------//


// Global Error Handler
app.use(globalErrorHandler)



module.exports = app;
