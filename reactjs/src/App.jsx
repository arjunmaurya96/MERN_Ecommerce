import React, { Suspense, lazy } from 'react'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'

import ScrollToTop from './components/ScrollToTop'

/* ✅ Sirf ye eagerly load karo (har page pe chahiye) */
import Navbar from './components/Pages/Navbar'
import Footer from './components/Pages/Footer'

/* ======================================================
   ✅ LAZY IMPORTS - sirf jab route visit ho tab load hoga
====================================================== */

/* WEBSITE */
const Home = lazy(() => import('./components/Homes/Home'))
const Shops = lazy(() => import('./components/Pages/Shops'))
const ProductDetails = lazy(() => import('./components/Pages/ProductDetails'))
const BestSellerPage = lazy(() => import('./components/Pages/BestSellerPage'))
const CartPage = lazy(() => import('./components/Pages/CartPage'))
const Checkout = lazy(() => import('./components/Pages/Checkout'))
const ContactUs = lazy(() => import('./components/Pages/ContactUs'))
const OrderSuccess = lazy(() => import('./components/Pages/OrderSuccess'))
const Page404 = lazy(() => import('./components/Pages/Page404'))

/* USER AUTH */
const Register = lazy(() => import('./components/Auth/Register'))
const Login = lazy(() => import('./components/Auth/Login'))
const ForgetPassword = lazy(() => import('./components/Auth/ForgetPassword'))
const ResetPassword = lazy(() => import('./components/Auth/ResetPassword'))

/* USER DASHBOARD */
const UserLayout = lazy(() => import('./components/UserAdmin/UserLayout'))
const UserDashboard = lazy(() => import('./components/UserAdmin/UserDashboard'))
const UserProfile = lazy(() => import('./components/UserAdmin/UserProfile'))
const MyUserOrder = lazy(() => import('./components/UserAdmin/Orders/MyUserOrder'))
const OrderDetails = lazy(() => import('./components/UserAdmin/Orders/OrderDetails'))
const TrackOrder = lazy(() => import('./components/UserAdmin/Orders/TrackOrder'))

/* ADMIN */
const AdminLayout = lazy(() => import('./components/Admin/AdminLayout'))
const Dashboard = lazy(() => import('./components/Admin/AdminPages/Dashboard'))
const AddProduct = lazy(() => import('./components/Admin/AdminPages/Products/AddProduct'))
const ProductList = lazy(() => import('./components/Admin/AdminPages/Products/ProductList'))
const CategoryList = lazy(() => import('./components/Admin/AdminPages/Categories/CategoryList'))
const AddCategory = lazy(() => import('./components/Admin/AdminPages/Categories/AddCategory'))
const EditCategory = lazy(() => import('./components/Admin/AdminPages/Categories/EditCategory'))
const EditProduct = lazy(() => import('./components/Admin/AdminPages/Products/EditProduct'))
const AdminLogin = lazy(() => import('./components/Admin/Auth/AdminLogin'))
const AdminForgetPassword = lazy(() => import('./components/Admin/Auth/AdminForgetPassword'))
const AdminResetPassword = lazy(() => import('./components/Admin/Auth/AdminResetPassword'))
const AdminOrders = lazy(() => import('./components/Admin/AdminPages/AdminOrder/AdminOrders'))
const AdminOrderDetails = lazy(() => import('./components/Admin/AdminPages/AdminOrder/AdminOrderDetails'))
const AdminPendingOrders = lazy(() => import('./components/Admin/AdminPages/AdminOrder/AdminPendingOrders'))
const AdminDeliveredOrders = lazy(() => import('./components/Admin/AdminPages/AdminOrder/AdminDeliveredOrders'))
const AllUsers = lazy(() => import('./components/Admin/AdminPages/AllUser/AllUsers'))
const ViewUserDetails = lazy(() => import('./components/Admin/AdminPages/AllUser/ViewUserDetails'))
const UserOrders = lazy(() => import('./components/Admin/AdminPages/AllUser/UserOrders'))

/* ======================================================
    LOADING SPINNER - lazy load hone tak dikhega
====================================================== */
const PageLoader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: '60vh' }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

/* ======================================================
   AUTH HELPERS
====================================================== */
const isUserAuthenticated = () => !!localStorage.getItem('userToken')
const isAdminAuthenticated = () => !!localStorage.getItem('adminToken')

const ProtectedRoute = ({ children }) =>
  isUserAuthenticated() ? children : <Navigate to="/login" replace />

const AuthRoute = ({ children }) =>
  isUserAuthenticated() ? <Navigate to="/" replace /> : children

const ProtectedAdminRoute = ({ children }) =>
  isAdminAuthenticated() ? children : <Navigate to="/admin/login" replace />

const AuthAdminRoute = ({ children }) =>
  isAdminAuthenticated() ? <Navigate to="/admin" replace /> : children


const Layout = ({ children }) => {
  const location = useLocation()

  const hideLayoutRoutes = ['/login', '/register', '/forget-password', '/reset-password']

  const hideLayout =
    hideLayoutRoutes.some(route => location.pathname.startsWith(route)) ||
    location.pathname.startsWith('/admin')

  return (
    <>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
    </>
  )
}

/* ======================================================
   APP
====================================================== */
const App = () => {
  return (
    <Layout>
      <ScrollToTop />

      {/* ✅ Suspense - lazy component load hone tak spinner dikhao */}
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ================= USER DASHBOARD ================= */}
          <Route path="/user" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="orders" element={<MyUserOrder />} />
            <Route path="order-details/:orderId" element={<OrderDetails />} />
            <Route path="track-order" element={<TrackOrder />} />
          </Route>

          {/* ================= WEBSITE ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/product-details/:slug" element={<ProductDetails />} />
          <Route path="/best-seller" element={<BestSellerPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/contact-us" element={<ContactUs />} />

          {/* ================= USER AUTH ================= */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/forget-password" element={<AuthRoute><ForgetPassword /></AuthRoute>} />
          <Route path="/reset-password/:token" element={<AuthRoute><ResetPassword /></AuthRoute>} />

          {/* ================= ADMIN AUTH ================= */}
          <Route path="/admin/login" element={<AuthAdminRoute><AdminLogin /></AuthAdminRoute>} />
          <Route path="/admin/forget-password" element={<AdminForgetPassword />} />
          <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />

          {/* ================= ADMIN DASHBOARD ================= */}
          <Route path="/admin" element={<ProtectedAdminRoute><AdminLayout /></ProtectedAdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="order/:orderId" element={<AdminOrderDetails />} />
            <Route path="pending-order" element={<AdminPendingOrders />} />
            <Route path="delivered-order" element={<AdminDeliveredOrders />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products-list" element={<ProductList />} />
            <Route path="category-list" element={<CategoryList />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="edit-category/:id" element={<EditCategory />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="all-users" element={<AllUsers />} />
            <Route path="user-details/:id" element={<ViewUserDetails />} />
            <Route path="user-orders/:id" element={<UserOrders />} />
          </Route>

          {/* ================= 404 ================= */}
          <Route path="*" element={<Page404 />} />

        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App