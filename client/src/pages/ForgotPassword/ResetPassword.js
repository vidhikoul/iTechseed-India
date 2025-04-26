import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios.post(`http://localhost:8800/ResetPassword/${id}/${token}`, { password })
      .then(res => {
        if (res.data.Status === "Success") {
          navigate("/Login");
        }
      })
      .catch(err => console.log("Error:", err));
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 mx-3">
        <div className="col-md-5 d-flex flex-column justify-content-center">
          <h2 className="mb-3">RESET PASSWORD</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                New Password<span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="password"
                className="form-control rounded-pill p-3"
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password<span className="text-danger">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="form-control rounded-pill p-3"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-pill py-2">
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

