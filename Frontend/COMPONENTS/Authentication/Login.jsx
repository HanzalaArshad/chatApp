import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {


   const [showPassword, setShowPassword] = useState(false);
    // const history = useHistory();
  
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // const [pic, setPic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate =useNavigate()
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    const handleLogin=async()=>{
      setLoading(true)
      if(!email || !password){
        toast.warning('please Enter the Credentials')
        setLoading(false);

        return
      }
       
       try {
        const config = {
          header: {
            "content-type": "application/json"
          }
        }
        

         const {data}=await axios.post("http://localhost:5000/api/user/login",{email,password},config);
         toast.success("login Successful");

         localStorage.setItem("userInfo",JSON.stringify(data))
         setLoading(false)
         navigate("/chat")
       } catch (error) {
        toast.error(error.message);
        setLoading(false)
      }
    }
  
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Login</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      <form >
        <div className="mb-3">
        <label className="form-label required-label">Name</label>
        <input type="text" className="form-control" placeholder="Enter your name" 
            onChange={(e) => setName(e.target.value)} required  />
        </div>

        <div className="mb-3">
        <label className="form-label required-label">Email</label>
          <input type="email" className="form-control" placeholder="Enter your email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
        <label className="form-label required-label">Password</label>
          <div className="input-group">
            <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)} value={password} required />
            <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading} onClick={handleLogin}>
          {loading ? "Loging..." : "Login"}
        </button>

        <button type="submit" className="btn btn-warning w-100 mt-3" disabled={loading} 
        onClick={()=>{
         setEmail("guest@example.com")
          setPassword("123456")
        }}>
          Guest Users
        </button>
      </form>
    </div>
  )
}

export default Login
