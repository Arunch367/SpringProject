import "../../styles/AdminLogin.css";
import logo from "../../styles/images/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link, Route, Routes } from "react-router-dom";
import Home from "../../components/home";
import { toast } from "react-hot-toast";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const login = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    const requestBody = { email, password };

    try {
      const response = await axios.post(
        "http://localhost:8080/adminLogin",
        requestBody
      );
      const admin = response.data;

      localStorage.setItem("adminId", admin.id);
      localStorage.setItem("role", "ADMIN"); // Explicitly setting admin role

      sessionStorage.setItem("adminId", admin.id);

      navigate("/admindashboard");

      toast.success("Successfully logged in");
    } catch (error) {
      setErrorMsg(error.response?.data?.errorMessage);
      toast.error("Failed to login");
    }
  };

  return (
    <div class="AdminLogin-body">
      <div class="topnav">
        <Link class="active" to="/">
          Home
        </Link>
      </div>
      <div class="flex-container">
        <img src={logo} alt="" />
        <h2>Welcome to Hamro Library</h2>
      </div>
      <div class="row">
        <h1>Admin Login</h1>
        <div class="form-group">
          <input
            type="Email"
            placeholder="Email"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            id="pwd"
            name="pwd"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="button" onClick={login}>
            Login
          </button>
          {errorMsg && (
            <h4
              className="error-message"
              style={{ color: "red", marginTop: "10px" }}
            >
              {errorMsg}
            </h4>
          )}
        </div>
      </div>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}
export default AdminLogin;
