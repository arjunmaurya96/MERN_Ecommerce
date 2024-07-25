import React, { useContext, useState } from 'react'
import AppContext from '../../context/AppContext'
import { useNavigate } from "react-router-dom"



const Login = () => {
  const { login } = useContext(AppContext)
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })


  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const { name, email, password } = formData;
  const submitHandler = async (e) => {
    e.preventDefault();
    // alert("Your form had been submited ..")

    const result = await login(email, password)

    if (result.success) {
      navigate('/')
    }
    // console.log(formData);

  }


  return (
    <>

      <div className="container my-5 p-4" style={{ width: "600px", border: "2px solid yellow", borderRadius: "10px" }}>
        <h1 className='text-center'>User Login </h1>
        <form className='my-3' onSubmit={submitHandler}>
         
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email </label>
            <input type="email" name='email' value={formData.email} onChange={onChangeHandler} className="form-control" id="exampleInputEmail2" aria-describedby="emailHelp" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
            <input type="password" name='password' value={formData.password} onChange={onChangeHandler} className="form-control" id="exampleInputPassword3" />
          </div>
          <div className='d-grid col-6 mx-auto'>
            <button type="submit" className="btn btn-primary my-3">Login</button>
          </div>

        </form>
      </div>

    </>
  )
}

export default Login