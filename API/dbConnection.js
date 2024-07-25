const mongoose = require("mongoose");


async function dbConnect(){
    try {
   
        await mongoose.connect("mongodb://0.0.0.0:27017/MERN_E_Commerce") 
        console.log("Database connected succesfully !");
        
        } catch (error) {
            console.log("Database Not Connected ?");
        }
}
dbConnect();