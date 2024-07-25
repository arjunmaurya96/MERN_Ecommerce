import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AppContext from '../context/AppContext'



const Navbar = () => {

  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate();
  const location = useLocation();

  const { setFilteredData, products, logout, setIsAuthenticated, isAuthenticate, cart } = useContext(AppContext)


  const filterbyCategory = (cat) => {
    setFilteredData(products.filter((data) => data.category.toLowerCase() == cat.toLowerCase()))
  }


  const filterbyPrice = (price) => {
    setFilteredData(products.filter((data) => data.price >= price))
  }

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("000", searchTerm, searchTerm.length)
    navigate(`/product/search/${searchTerm}`);
    setSearchTerm("")
  }

  return (
    <>

      <div className="nav sticky-top">
        <div className="nav_bar">
          <Link to={"/"} className="left" style={{ textDecoration: "none", color: "white" }}>
            <h3>MERN E - Commerce </h3>
          </Link>
          <form className="search_bar" onSubmit={submitHandler}>
            <span className="material-symbols-outlined">
              search
            </span>
            <input value={searchTerm} onChange={(e) => {
              console.log(e.target.value, e.target.value.length)
              setSearchTerm(e.target.value)
            }} type="text" name="" placeholder='Search Products...' id="" />
          </form>

          <div className="right">
            {
              isAuthenticate && (

                <>
                  {
                    cart?.items?.length > 0 && (
                      <>

                        <Link to={'/cart'} type="button" className="btn btn-primary position-relative mx-3">
                          <span class="material-symbols-outlined">
                            shopping_cart
                          </span>
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cart?.items?.length}
                            <span className="visually-hidden">unread messages</span>
                          </span>
                        </Link>
                      </>
                    )
                  }

                  <Link to={'/profile'} className='btn btn-info mx-3'>profile </Link>
                  <button className='btn btn-danger mx-3' onClick={() => { logout(); }}>logout</button>
                </>
              )
            }
            
            {
              !isAuthenticate && (
                <>
                  <Link to={"/login"} className='btn btn-info mx-3'>Login</Link>
                  <Link to={"/register"} className='btn btn-info mx-3'>register</Link>
                </>
              )
            }
          </div>
        </div>


        {
          location.pathname == '/' && (
            <div className="sub_bar">
              <div className="items" onClick={() => setFilteredData(products)}>No Filter</div>
              <div className="items" onClick={() => filterbyCategory("mobiles")}>Mobiles </div>
              <div className="items" onClick={() => filterbyCategory("laptops")}>Laptops</div>
              <div className="items" onClick={() => filterbyCategory("cameras")}>Camera's</div>
              <div className="items" onClick={() => filterbyCategory("headphones")}>Headphones </div>
              <div className="items" onClick={() => filterbyPrice(15999)}>15999</div>
              <div className="items" onClick={() => filterbyPrice(25999)}>25999</div>
              <div className="items" onClick={() => filterbyPrice(65999)}>69999</div>
              <div className="items" onClick={() => filterbyPrice(85999)}>89000</div>
              <div className="items" onClick={() => filterbyPrice(45999)}>49999</div>
            </div>
          )
        }


      </div>


    </>
  )
}

export default Navbar