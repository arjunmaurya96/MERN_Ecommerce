const mongoose = require("mongoose");


const ConnectionDb = async()=>{
try {
   await mongoose.connect(process.env.MONGO_URL);
   console.log(`Database Connected Successfully...!`)
    
} catch (error) {
    console.log(error)
    console.log(`Database not connected...?`)
}

}

ConnectionDb();