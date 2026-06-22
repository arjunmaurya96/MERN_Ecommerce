import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* ---------- CREATE CONTEXT ---------- */
const AuthContext = createContext();

/* ---------- AXIOS INSTANCE ---------- */
const API = axios.create({
  baseURL: "https://mern-ecommerce-zt4z.onrender.com/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/* ---------- PROVIDER ---------- */
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [userToken, setUserToken] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  /* ================= LOAD USER TOKEN ================= */
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setUserToken(token);
  }, []);

  /* ================= LOAD CART ================= */
  const loadCart = async () => {
    try {
      const res = await API.get("/cart/get-cart");
      setCartItems(res.data?.cart?.items ?? []);
    } catch (error) {
      console.error("Load cart error:", error);
      setCartItems([]);
    }
  };

  /* ================= LOAD CART AFTER LOGIN ================= */
  useEffect(() => {
    if (userToken) {
      loadCart();
    }
  }, [userToken]);

  /* ================= ADD TO CART ================= */
  const addToCart = async (product, qty = 1) => {
    await API.post("/cart/add-two-cart", {
      productId: product._id,
      qty,
    });
    loadCart();
  };

  /* ================= REMOVE ITEM ================= */
  const removeFromCart = async (productId) => {
    await API.delete(`/cart/remove-from-cart/${productId}`);
    loadCart();
  };

  /* ================= UPDATE QTY ================= */
  const updateQty = async ({ productId, qty }) => {
    if (!productId || qty < 1) return;

    await API.put("/cart/update-cart-qty", {
      productId,
      qty,
    });

    loadCart();
  };

  /* ================= CLEAR CART (FIXED) ================= */
  const clearCart = async () => {
    await API.delete("/cart/clear-cart");
    setCartItems([]);
  };

  /* ================= TOTALS ================= */
  const cartCount = cartItems.reduce((t, i) => t + i.qty, 0);
  const cartTotal = cartItems.reduce((t, i) => t + i.price * i.qty, 0);

  /* ================= LOGIN ================= */
  const login = (token) => {
    localStorage.setItem("userToken", token);
    setUserToken(token);
    loadCart();
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("userToken");
    setUserToken(null);
    setCartItems([]);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        login,
        logout,
        isAuthenticated: !!userToken,

        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ---------- CUSTOM HOOK ---------- */
export const useAuth = () => useContext(AuthContext);
