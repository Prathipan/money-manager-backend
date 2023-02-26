const express =require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose");
const cors = require("cors")
const userRouter = require("./routes/users.js");
const transactionRouter = require("./routes/transaction.js");
const historyRouter = require("./routes/history.js");

const app = express();
dotenv.config();

mongoose.set("strictQuery",false);

mongoose.connect(process.env.MONGO_URL).then(()=> {
    console.log("DB connected Successfully");
}).catch((err)=>{
    console.log(err);
})

app.use(cors())
app.use(express.json());
app.use("/api/user",userRouter)
app.use("/api/transaction",transactionRouter)
// app.use("/api/history",historyRouter)

app.listen(process.env.PORT || "5000",() =>{
    console.log("server is running")
})