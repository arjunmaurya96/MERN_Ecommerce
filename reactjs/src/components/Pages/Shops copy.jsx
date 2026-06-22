import React, {
    useEffect,
    useState,
    useMemo,
    useCallback
} from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import HeroNavbar from "./HeroNavbar";
import ProductOffer from "./ProductOffer";
import Services from "./Services";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

const Shops = () => {
    const navigate = useNavigate();
    const { addToCart, isAuthenticated, cartItems } = useAuth();

    /* ================= STATES ================= */
    const [products, setProducts] = useState([]);
    const [mainCategories, setMainCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [price, setPrice] = useState(10000);
    const [selectedSub, setSelectedSub] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 6;

    /* ================= API CALLS ================= */
    useEffect(() => {
        fetchProducts();
        fetchMainCategories();
        fetchAllCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await axios.get(
            "http://localhost:8080/api/product/get-product"
        );
        setProducts(res.data.products || []);
    };

    const fetchMainCategories = async () => {
        const res = await axios.get(
            "http://localhost:8080/api/category/get-main-category"
        );
        setMainCategories(res.data.data || []);
    };

    const fetchAllCategories = async () => {
        const res = await axios.get(
            "http://localhost:8080/api/category/get-all-category"
        );
        setAllCategories(res.data.data || []);
    };

    /* ================= SEARCH DEBOUNCE ================= */
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(timer);
    }, [search]);

    /* ================= HELPERS ================= */
    const getImage = (images) =>
        images && images.length ? images[0] : "/img/no-image.png";

    const getSubCategories = useCallback(
        (mainId) =>
            allCategories.filter(
                (cat) =>
                    cat.type === "sub" &&
                    cat.parent &&
                    cat.parent._id === mainId
            ),
        [allCategories]
    );

    /* ================= FILTER ================= */
    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchSearch = item.name
                .toLowerCase()
                .includes(debouncedSearch.toLowerCase());

            const matchPrice = item.discountPrice <= price;
            const matchSub =
                !selectedSub || item.category?._id === selectedSub;

            return matchSearch && matchPrice && matchSub;
        });
    }, [products, debouncedSearch, price, selectedSub]);

    /* ================= PAGINATION ================= */
    const totalPages = Math.ceil(
        filteredProducts.length / productsPerPage
    );
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(
        startIndex,
        startIndex + productsPerPage
    );

    /* ================= ADD TO CART ================= */
    const handleAddToCart = useCallback(
        async (item) => {
            if (!isAuthenticated) {
                toast.error("Please login to add items to cart");
                navigate("/login");
                return;
            }

            const alreadyInCart = cartItems.some(
                (cartItem) => cartItem.product._id === item._id
            );

            if (alreadyInCart) {
                toast.error(
                    "Already added to cart. Update quantity from cart page"
                );
                return;
            }

            await addToCart(item, 1);
            toast.success("Product added to cart 🛒");
        },
        [isAuthenticated, cartItems, navigate, addToCart]
    );

    /* ================= UI ================= */
    return (
        <>
            <Toaster />
            <HeroNavbar />

            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">
                    Shop
                </h1>
            </div>

            <Services />
            <ProductOffer />

            <div className="container-fluid shop py-5">
                <div className="container-fluid">
                    <div className="row g-4">

                        {/* ================= SIDEBAR ================= */}
                        <div className="col-lg-3">

                            {/* PRICE FILTER */}
                            <div className="card shadow-sm border-0 rounded-4 mb-4">
                                <div className="card-body">
                                    <h5 className="fw-bold mb-3">
                                        Filter by Price
                                    </h5>





                                    <input
                                        type="range"
                                        className="form-range"
                                        min="0"
                                        max="10000"
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                    />

                                    <div className="d-flex justify-content-between mt-2">
                                        <small>₹0</small>
                                        <span className="badge bg-primary">
                                            ₹ {price}
                                        </span>
                                        <small>₹10000</small>
                                    </div>
                                </div>
                            </div>

                            {/* CATEGORY FILTER */}
                            <div className="card shadow-sm border-0 rounded-4">
                                <div className="card-body">
                                    <h5 className="fw-bold mb-3">
                                        Categories
                                    </h5>

                                    {mainCategories.map((main) => {
                                        const subs = getSubCategories(main._id);
                                        if (subs.length === 0) return null;

                                        return (
                                            <div key={main._id} className="mb-4">
                                                <h6 className="fw-semibold mb-2 text-primary">
                                                    {main.name}
                                                </h6>

                                                <div className="d-flex flex-wrap gap-2">
                                                    {subs.map((sub) => (
                                                        <span
                                                            key={sub._id}
                                                            className={`px-3 py-1 rounded-pill border ${selectedSub === sub._id
                                                                ? "bg-primary text-white border-primary"
                                                                : "bg-light text-dark"
                                                                }`}
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                setSelectedSub(sub._id);
                                                                setCurrentPage(1);
                                                            }}
                                                        >
                                                            {sub.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {selectedSub && (
                                        <button
                                            className="btn btn-outline-danger btn-sm w-100 mt-3"
                                            onClick={() => setSelectedSub(null)}
                                        >
                                            Clear Category
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ================= PRODUCTS ================= */}
                        
                        <div className="col-lg-9">
                            
                                    <div className="rounded mb-4 position-relative">
                                        <img
                                            src="/img/product-banner-3.jpg"
                                            className="img-fluid rounded w-100"
                                            style={{ height: "250px" }}
                                            alt="Sale Banner"
                                        />

                                        <div
                                            className="position-absolute rounded d-flex flex-column align-items-center justify-content-center text-center"
                                            style={{
                                                width: "100%",
                                                height: "250px",
                                                top: 0,
                                                left: 0,
                                                background: "rgba(242, 139, 0, 0.3)",
                                            }}
                                        >
                                            <h4 className="display-5 text-primary">SALE</h4>
                                            <h3 className="display-4 text-white mb-4">
                                                Get UP To 50% Off
                                            </h3>

                                            <Link
                                                to="#"
                                                className="btn btn-primary rounded-pill"
                                            >
                                                Shop Now
                                            </Link>
                                        </div>
                                    </div>


                            <input
                                type="search"
                                className="form-control p-3 mb-4"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            {/* ✅ PRODUCT NOT FOUND MESSAGE */}
                            {selectedSub && currentProducts.length === 0 && (
                                <div className="alert alert-warning text-center" style={{ marginTop: "20%" }}>
                                    <i className="fas fa-exclamation-circle me-2"></i>
                                    Product not found in this category
                                </div>
                            )}

                            <div className="row g-4">
                                {currentProducts.map((item) => (
                                    <div className="col-lg-4" key={item._id}>
                                        <div className="product-item border rounded overflow-hidden">

                                            <div className="position-relative">
                                                <img
                                                    src={getImage(item.images)}
                                                    className="img-fluid w-100"
                                                    alt={item.name}
                                                    style={{
                                                        height: 220,
                                                        objectFit: "cover"
                                                    }}
                                                />

                                                <Link
                                                    to={`/product-details/${item.slug}`}
                                                    className="position-absolute top-50 start-50 translate-middle bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: 45, height: 45 }}
                                                >
                                                    <i className="fa fa-eye"></i>
                                                </Link>
                                            </div>

                                            <div className="p-3 text-center">
                                                <p className="mb-1">
                                                    {item.category?.name}
                                                </p>

                                                <h6>{item.name}</h6>

                                                <del className="me-2">
                                                    ₹{item.price}
                                                </del>
                                                <span className="text-primary">
                                                    ₹{item.discountPrice}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleAddToCart(item)
                                                    }
                                                    className="btn btn-primary w-100 mt-3"
                                                >
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            className={`btn btn-sm mx-1 ${currentPage === i + 1
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                                }`}
                                            onClick={() =>
                                                setCurrentPage(i + 1)
                                            }
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Shops;
