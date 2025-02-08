import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./ForgotPassword.css"; // Add custom styles if necessary

const ForgotPassword = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const handleSignup = (e) => {
    e.preventDefault(); // ✅ Prevent full-page reload
    navigate("/Registration"); // ✅ Navigate to Signup page
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 mx-3">
        {/* Left Section - Form */}
        <div className="col-md-5 d-flex flex-column justify-content-center">
          <h2 className="mb-3">FORGOT PASSWORD?</h2>
          <p className="mb-4">
            Please enter your account’s email address and we will send you a
            link to reset your password.
          </p>
          <form>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address<span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                className="form-control rounded-pill p-3"
                placeholder="Enter your email"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">
              SUBMIT
            </button>
          </form>
          <div className="mt-3 text-center">
            <span>Don’t have an account? </span>
            <a href="#" className="text-primary" onClick={handleSignup}>
              Sign up
            </a>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="col-md-6 d-none d-md-block">
          <div className="d-flex justify-content-center align-items-center h-100">
            <img
              src="forgot.png"
              alt="Illustration"
              className="img-fluid"
              style={{ maxHeight: "400px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
