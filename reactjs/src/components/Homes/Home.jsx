import React from 'react'
import Hero from '../Pages/Hero'
import Services from '../Pages/Services'
import ProductOffer from '../Pages/ProductOffer'
import OurProduct from '../Pages/OurProduct'
import ProductBanner from '../Pages/ProductBanner'
import ProductList from '../Pages/ProductList'
import BestSeller from '../Pages/BestSeller'
import HeroNavbar from '../Pages/HeroNavbar'

const Home = () => (
  <>
    <HeroNavbar />
    <Hero />
    <Services />
    <ProductOffer />
    <OurProduct />
    <ProductBanner />
    <ProductList />
    <BestSeller />
  </>
)

export default Home