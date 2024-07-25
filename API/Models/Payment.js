const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    orderData:{type:Date, default:Date.now},
    payStatus:{type:String}
},{statics:false})


const Payment  = mongoose.model('Payment', paymentSchema)
module.exports = Payment;               