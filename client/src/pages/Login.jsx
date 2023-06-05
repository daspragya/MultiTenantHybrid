import React, { useState } from "react";
import api from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [confpassword, setConfPassword] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    if (name === "confpassword") setConfPassword(value);
  };

  const handleToggleSignup = () => {
    setIsSignup((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, password };
    if (isSignup) {
      if (password === confpassword) {
        try {
          await api.signUp(payload);
          alert("User created!");
          window.location.href = `/`;
        } catch (error) {
          alert(`Error: ${error.response.data.message} Try Again!`);
        }
      } else {
        alert("Passwords do not match!");
      }
    } else {
      try {
        const response = await api.signIn(payload);
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        window.location.href = "/";
      } catch (error) {
        alert(`${error.response.data.message}. Try Again!`);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {isSignup && (
          <div className="form-group">
            <label htmlFor="confpassword">Confirm Password:</label>
            <input
              type="password"
              className="form-control"
              id="confpassword"
              name="confpassword"
              value={confpassword}
              onChange={handleChange}
            />
          </div>
        )}
        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            {isSignup ? "Signup" : "Login"}
          </button>
        </div>
      </form>
      <p className="mt-3">
        {isSignup ? (
          <span>
            Already have an account?{" "}
            <button className="btn btn-link p-0" onClick={handleToggleSignup}>
              Continue
            </button>
          </span>
        ) : (
          <span>
            Don't have an account?{" "}
            <button className="btn btn-link p-0" onClick={handleToggleSignup}>
              Signup
            </button>
          </span>
        )}
      </p>
    </div>
  );
}

export default Login;
