const Cart = require("../Models/CartSchema")

// add to Cart 
async function addtoCart(req, res) {
    const { productId, title, price, qty, imgsrc } = req.body;
    try {
        const userId = req.user;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        const itemIndex = cart.items.findIndex((item) =>
            item.productId.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].qty += Number(qty);
            cart.items[itemIndex].price += price * qty;
        } else {
            cart.items.push({ productId, title, price, qty, imgsrc });
        }


        await cart.save()
        res.json({ message: "Item Added To Cart ", cart })

    } catch (error) {

    }
}

// get User Cart 

async function userCart(req, res) {
    try {
        const userId = req.user;
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ message: "Cart not found " })
        res.json({ message: "User cart ", cart })

    } catch (error) {

    }
}

// remove product from cart 
async function removeProductFromCart(req, res) {
    const productId = req.params.prodductId;
    try {
        const userId = req.user;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.json({ message: "Cart not found " })
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId)
        await cart.save();
        res.json({ message: "Product remove from cart ", cart })

    } catch (error) {

    }
}


// clear cart 
async function clearCart(req, res){
const userId = req.user;
let cart = await Cart.findOne({userId})
if(!cart) {
    let cart = new Cart({item:[]})
}else {
    cart.items = [];
}
await cart.save();
res.json({message:"cart clear"});
}

// decrease qty from cart 

async function decreaseProuductQty(req, res) {
    const { productId,  qty } = req.body;
    try {
        const userId = req.user;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }
        const itemIndex = cart.items.findIndex((item) =>
            item.productId.toString() === productId);

        if (itemIndex > -1) {
            const item = cart.items[itemIndex]
            if(item.qty > qty){
                const pricePerUnit = item.price/item.qty
                
                item.qty -= qty
                item.price -= pricePerUnit*qty
            }
           else {
            cart.items.splice(itemIndex,1)
           }
        } else {
          return res.json({message:"Invalid product Id "})
        }


        await cart.save()
        res.json({ message: "Item qty decreased ", cart })

    } catch (error) {

    }
}



module.exports = {
    addtoCart: addtoCart,
    userCart: userCart,
    removeProductFromCart: removeProductFromCart,
    clearCart:clearCart,
    decreaseProuductQty:decreaseProuductQty
}