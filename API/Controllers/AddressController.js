const Address = require("../Models/AddressSchema")

async function addAddress(req, res) {
    let { fullName, address, city, state, country, pincode, phoneNumber } = req.body;
    try {
        let userId = req.user;

        let userAddress = await Address.create({

            userId,
            fullName,
            address,
            city,
            state,
            country,
            pincode,
            phoneNumber
        });
        res.json({ message: "Address added ", userAddress, success:true })

    } catch (error) {

    }
}

async function getAddress(req, res){
    try {
        let address = await Address.find({userId:req.user}).sort({createdAt:-1})
        res.json({message:"address", userAddress:address[0]})
        
    } catch (error) {
        
    }
}


module.exports = {
    addAddress: addAddress,
    getAddress:getAddress
}