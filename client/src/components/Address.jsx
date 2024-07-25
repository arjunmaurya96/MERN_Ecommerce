import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import AppContext from '../context/AppContext';




const Address = () => {
  const { shippingAddress, userAddress } = useContext(AppContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNumber: ""

  })


  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const { fullname, address, city, state, country, pincode, phoneNumber } = formData;
  const submitHandler = async (e) => {
    e.preventDefault();
    // alert("Your form had been submited ..")
    // console.log(formData);



    const result = await shippingAddress(fullname, address, city, state, country, pincode, phoneNumber)

    if (result.success) {
      navigate('/checkout')
    }
    console.log("address added ", result); 
    setFormData(
      {
        fullname: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        phoneNumber: ""

      }
    )

  }


  return (
    <>

      <div className="container my-2 p-4" style={{ border: "2px solid yellow", borderRadius: "10px" }}>
        <h1 className='text-center'>Shipping Address  </h1>
        <form className='my-3' onSubmit={submitHandler}>
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label"> Full Name  </label>
              <input type="text" name='fullname' value={formData.fullname} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">Country  </label>
              <input type="text" name='country' value={formData.country} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputEmail2" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputPassword1" className="form-label">State</label>
              <input type="text" name='state' value={formData.state} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputPassword3" />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label"> City   </label>
              <input type="text" name='city' value={formData.city} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">Pincode   </label>
              <input type="number" name='pincode' value={formData.pincode} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputEmail2" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputPassword1" className="form-label">Phone Number </label>
              <input type="number" name='phoneNumber' value={formData.phoneNumber} onChange={onChangeHandler} className="form-control bg-dark text-light" id="exampleInputPassword3" />
            </div>
          </div>
          <div className="row">

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label"> AddressLine/Nearby </label>
              <textarea type="text" name='address' value={formData.address} onChange={onChangeHandler} className="form-control bg-dark text-light " id="exampleInputPassword3" ></textarea>
            </div>
          </div>

          <div className='d-grid col-6 mx-auto'>
            <button type="submit" className="btn btn-primary my-3" style={{fontWeight:"bold"}}>Submit </button>
          </div>

        </form>
        {
          userAddress && (

      <div className="d-grid col-6 mx-auto my-3">
        <button className='btn btn-warning' style={{fontWeight:"bold"}} onClick={()=>navigate('/checkout')} >User Old Address </button>
      </div>

          )
        }
      </div>

    </>
  )
}

export default Address