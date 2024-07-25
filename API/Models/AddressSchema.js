const mongoose = require("mongoose")

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    state: {
        type: String,
        require: true
    },
    country: {
        type: String,
        require: true
    },
    pincode: {
        type: String,
        require: true
    },
    phoneNumber: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


const Address = mongoose.model("Address", addressSchema)

module.exports = Address;

