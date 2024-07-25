const jwt = require("jsonwebtoken")
const User = require("../Models/User")

async function Authenticated(req, res, next){

const token = req.header("Auth")

if(!token) return res.json({message:"Login first"})

    const decoded = jwt.verify(token,"!@#$%^&*()");
    
    const id = decoded.userId
    
let user = await User.findById(id)
if(!user) return res.json({message:"User not exist "})

    req.user = user          
    next();                                          

    // console.log(decoded);

}

module.exports = Authenticated;