import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Import Axios

const RegisterPage = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    termsAccepted: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.termsAccepted) {
      alert("You must accept the Terms of Use and Privacy Policy.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/register", formData);

      if (response.status === 201) {
        alert("User registered successfully!");
        navigate("/home"); // ✅ Redirect after successful registration
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      alert("Registration failed! Please try again.");
    }
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center overflow-hidden">
      <div className="row w-100 shadow-lg rounded overflow-hidden bg-white">
        <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
          <img src="login.png" alt="Illustration" className="img-fluid" style={{ maxHeight: "400px", objectFit: "contain" }} />
        </div>

        <div className="col-md-6 p-5">
          <h2 className="mb-4">REGISTER</h2>
          <p className="text-muted mb-4 font-weight-bold">
            Manage inventory<br />Track & organize your inventory with ease
          </p>
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <input type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} className="form-control" required />
              </div>
              <div className="col-6">
                <input type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} className="form-control" required />
              </div>
            </div>
            <div className="mb-3">
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <input type="password" name="password" placeholder="Password (8 characters required)" value={formData.password} onChange={handleInputChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <select name="role" value={formData.role} onChange={handleInputChange} className="form-control" required>
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="manager">Manager</option>
                <option value="security guard">Security Guard</option>
              </select>
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" id="terms" checked={formData.termsAccepted} onChange={handleCheckboxChange} className="form-check-input" />
              <label htmlFor="terms" className="form-check-label">
                I agree to all <a href="Terms">Terms of Use</a> and <a href="Privacy">Privacy Policy</a>
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">CREATE ACCOUNT</button>
          </form>
          <p className="text-center mt-4">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate("/home"); }}>Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
