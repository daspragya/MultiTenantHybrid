import React, { useState, useEffect } from "react";
import { login, signup, getTenantNames } from "../api"; // Import the login, signup, and getTenantNames API calls

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [confpassword, setConfPassword] = useState("");
  const [tenantNames, setTenantNames] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState("");

  useEffect(() => {
    const fetchTenantNames = async () => {
      try {
        const response = await getTenantNames();
        setTenantNames(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTenantNames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confpassword") setConfPassword(value);
  };

  const handleToggleSignup = () => {
    setIsSignup((prevState) => !prevState);
  };

  const handleTenantChange = (e) => {
    setSelectedTenant(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      if (password === confpassword) {
        if (!selectedTenant) {
          alert("Please select a tenant");
          return;
        }
        const payload = { email, password, selectedTenant };
        await signup(payload)
          .then((res) => {
            alert("User created!");
            localStorage.setItem("tenantName", res.data.tenantName);
            localStorage.setItem(
              "userTenants",
              JSON.stringify(res.data.userTenants)
            );
            window.location.href = "/";
          })
          .catch((error) => {
            alert(error.response.data.error);
            console.log(error);
          });
      } else {
        alert("Passwords do not match!");
      }
    } else {
      const payload = { email, password };
      await login(payload)
        .then((res) => {
          alert("User signed in!");
          localStorage.setItem("tenantName", res.data.tenantName);
          localStorage.setItem(
            "userTenants",
            JSON.stringify(res.data.userTenants)
          );
          window.location.href = "/";
        })
        .catch((error) => {
          if (error.response.data.error.split("/")[1]) {
            alert(`Error: ${error.response.data.error.split("/")[1]}`);
          } else {
            alert(`Error: Wrong email`);
          }
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
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
            required
          />
        </div>
        {isSignup && (
          <div>
            <div className="form-group">
              <label htmlFor="confpassword">Confirm Password:</label>
              <input
                type="password"
                className="form-control"
                id="confpassword"
                name="confpassword"
                value={confpassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="tenant">Select Tenant:</label>
              <select
                className="form-control"
                id="tenant"
                name="tenant"
                value={selectedTenant}
                onChange={handleTenantChange}
                required
              >
                <option value="">Select a tenant</option>
                {tenantNames.map((tenant, index) => (
                  <option key={index} value={tenant}>
                    {tenant}
                  </option>
                ))}
              </select>
            </div>
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
              Login
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
