
require("dotenv").config();
const connectDB = require("./config/db.js");
const app = require("./app.js");



async function startServer(){
  await connectDB();
  
  app.listen(process.env.PORT, () =>
    console.log(`server listening on ${process.env.PORT}`)
  );
}

startServer()


process.on("unhandledRejection" , (err) => {
  console.error({ error: err , message: 'Unhandled Rejection' });
  process.exit(1)
})