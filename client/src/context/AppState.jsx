import React, { useEffect, useState } from 'react'
import AppContext from './AppContext'
import axios from 'axios'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AppState = (props) => {
    const url = "http://localhost:1000/api";
    const [products, setProducts] = useState([])
    const [token, setToken] = useState([]);
    const [isAuthenticate, setIsAuthenticated] = useState(false);
    const [filteredData, setFilteredData] = useState([])
    const [user, setUser] = useState()
    const [cart, setCart] = useState([])
    const [reload, setReload] = useState(false)
    const [userAddress, setUserAddress] = useState("")

    useEffect(() => {

        const fetchProduct = async () => {
            const api = await axios.get(`${url}/product/all`, {
                headers: {
                    "Content-Type": "Application/json"
                },
                withCredentials: true
            });
            // console.log(api.data.products);
            setProducts(api.data.products)
            setFilteredData(api.data.products)
            userProfile();

        }
        fetchProduct()
        userCart();
        getAddress();
    }, [token, reload])


    useEffect(() => {

        let Istoken = localStorage.getItem('token')

        if (Istoken) {
            setToken(Istoken);
            setIsAuthenticated(true)

        }
    }, [])


    // register user 
    const register = async (name, email, password) => {
        const api = await axios.post(`${url}/user/register`, {
            name, email, password
        }, {
            headers: {
                "Content-Type": "Application/json"
            },
            withCredentials: true
        });
        // alert(api.data.message)
        // console.log("user Register",api);
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        return api.data;

    }



    // Login user 
    const login = async (email, password) => {
        const api = await axios.post(`${url}/user/login`, {
            name, email, password
        }, {
            headers: {
                "Content-Type": "Application/json",

            },
            withCredentials: true
        });
        // alert(api.data.message)
        // console.log("user Register",api);
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

        // console.log("User Login",api.data);
        setToken(api.data.token)
        setIsAuthenticated(true)
        localStorage.setItem('token', api.data.token)
        return api.data;

    }



    // logout user 

    const logout = () => {
        console.log("hhhh")
        setIsAuthenticated(false)
        setToken(" ")
        localStorage.removeItem('token')

        toast.success("Logout Successfully...!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

        navigate('/')

    }



    // user profile 

    const userProfile = async () => {
        const api = await axios.get(`${url}/user/profile`, {
            headers: {
                "Content-Type": "Application/json",
                "Auth": token
            },
            withCredentials: true
        });
        // console.log("user profile", api.data.user);
        setUser(api.data.user)

    }


    // add To Cart 

    const addToCart = async (productId, title, price, qty, imgsrc) => {
        const api = await axios.post(`${url}/cart/add`, {
            productId, title, price, qty, imgsrc
        }, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        setReload(!reload)
        // console.log("my Cart",api);
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });


    }



    // user Cart 

    const userCart = async () => {
        const api = await axios.get(`${url}/cart/user`, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        // console.log("User cart", api.data.cart);
        setCart(api.data.cart)

    }


    // --qty 

    const decreaseQty = async (productId, qty) => {
        const api = await axios.post(`${url}/cart/--qty`, {
            productId, qty
        }, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        setReload(!reload)
        // console.log("decrease cart items ", api);
        // setCart(api.data.cart)
        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

    }


    // remove  item from cart  
    const removeFromCart = async (productId) => {
        const api = await axios.delete(`${url}/cart/remove/${productId}`, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        // console.log("User cart", api.data.cart);
        setReload(!reload)
        console.log("remove items from cart", api);

        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

    }

    // clear cart  
    const clearCart = async () => {
        const api = await axios.delete(`${url}/cart/clear`, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        // console.log("User cart", api.data.cart);
        setReload(!reload)
        console.log("remove items from cart", api);

        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });

    }


    //add shipping address 
    const shippingAddress = async (fullName, address, city, state, country, pincode, phoneNumber) => {
        const api = await axios.post(`${url}/address/add`, {
            fullName, address, city, state, country, pincode, phoneNumber
        }, {
            headers: {
                "Content-Type": "Application/json",
                Auth: token
            },
            withCredentials: true
        });
        // console.log("User cart", api.data.cart);
        setReload(!reload)
        console.log("Address added successfully ", api);

        toast.success(api.data.message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        return api.data;
    }


    // get User letest address 

    const getAddress = async () => {
        const api = await axios.get(`${url}/address/get`, {
            headers: {
                "Content-Type": "Application/json",
                Auth:token
            },
            withCredentials: true
        });
        // console.log("user address get",api.data.userAddress);
        setUserAddress(api.data.userAddress)
     
    }

    return (
        <>
            <AppContext.Provider value={{
                products,
                register,
                login,
                url,
                token,
                setIsAuthenticated,
                isAuthenticate,
                filteredData,
                setFilteredData,
                logout,
                user,
                addToCart,
                cart,
                decreaseQty,
                removeFromCart,
                clearCart,
                shippingAddress,
                userAddress
            }}>
                {props.children}
            </AppContext.Provider>

        </>
    )
}

export default AppState