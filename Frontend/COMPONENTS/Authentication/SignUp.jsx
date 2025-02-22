import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LuPersonStanding } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!name || !email || !password) {
      toast.warning("Fill all the fields");
      setLoading(false);
      return;
    }
  
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      setLoading(false); // Add this line to stop loading when passwords don't match
      return;
    }
  
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
  
      const { data } = await axios.post("https://chatapp-production-31d4.up.railway.app/api/user", { name, email, password, pic }, config);
  
      toast.success("Sign Up Successfully Done");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
  
      navigate("/chat");
    } catch (error) {
      toast.error("Sign up failed");
      setLoading(false);
    }
  };
  

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast.warning("Please select an image");
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatApp");
      data.append("cloud_name", "dqgr3mzzb");

      fetch("https://api.cloudinary.com/v1_1/dqgr3mzzb/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch(() => {
          toast.error("Error uploading image");
          setLoading(false);
        });
    } else {
      toast.warning("Invalid image type selected");
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 ">
      <h2 className="mb-3">Sign Up</h2>
      {message && <div className="alert alert-warning">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label required-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Enter your name" 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label required-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}  
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label required-label">Password</label>
          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control" 
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}  
              required 
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label required-label">Confirm Password</label>
          <div className="input-group">
            <input 
              type={showPassword ? "text" : "password"} 
              className="form-control" 
              placeholder="Confirm password"
              onChange={(e) => setConfirmPassword(e.target.value)}  
              required 
            />
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={togglePasswordVisibility}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Profile Picture</label>
          <input 
            type="file" 
            className="form-control" 
            accept="image/*" 
            onChange={(e) => postDetails(e.target.files[0])} 
            required 
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-100" 
          disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
