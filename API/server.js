const express = require("express");
require("./dbConnection");
const userRouter = require('./Routes/UserRoute')
const bodyParser = require("body-parser")
const productRouter = require('./Routes/ProductRoute')
const cartRouter = require("./Routes/CartRoute")
const addAddressRouter = require("./Routes/AddressRoute")
const cors = require("cors")

const app = express();

app.use(bodyParser.json())
app.use(cors({
    origin:true,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true
}))
const port = 1000;


//Home testing routes 
app.get("/", (req, res) =>
    res.json({ message: "This is home routes" })
)

// user Router 
app.use('/api/user', userRouter)

// product Router
app.use('/api/product', productRouter)

// Cart Rotuer
app.use('/api/cart', cartRouter)

//address Rotuer 
app.use("/api/address", addAddressRouter)




app.listen(port, () => console.log(`Server is running on port ${port}`));

















