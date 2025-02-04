import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = ({ setIsLoggedIn }) => {
  const navigate = useNavigate(); // ✅ Define navigate

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent page reload
    setIsLoggedIn(true); // Set login state
    navigate("/home"); // Redirect to home page
  };

  const handleSignUp = () => {
    navigate("/registration"); // ✅ Redirect to Registration page
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password"); // ✅ Redirect to Forgot Password page
  };

  return (
    <div className="container vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-5 d-flex flex-column justify-content-center">
          <h2 className="mb-3">LOG IN</h2>
          <h5 className="mb-4">Welcome! Please login with your credentials</h5>
          <form onSubmit={handleLogin}> {/* ✅ Attach handleLogin to form submission */}
            <div className="mb-3">
              <label className="form-label">Email Address*</label>
              <input type="email" className="form-control" placeholder="Enter email" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password*</label>
              <input type="password" className="form-control" placeholder="Enter password" required />
            </div>
            <div className="mb-3 d-flex justify-content-between">
              <a href="#" className="text-decoration-none" onClick={handleForgotPassword}>Forgot password?</a> {/* ✅ Added click event */}
            </div>
            <button type="submit" className="btn btn-dark w-100">LOGIN</button> {/* ✅ Removed onClick */}
          </form>
          <p className="mt-3">
            Don’t have an account? <a href="#" className="text-primary" onClick={handleSignUp}>Sign up</a>
          </p>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          {/* ✅ Kept your image unchanged */}
          <img
            src="login.png"
            alt="Illustration"
            className="img-fluid"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
