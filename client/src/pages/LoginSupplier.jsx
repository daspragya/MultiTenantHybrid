import React, { useState, useEffect } from "react";
import api from "../api";

function LoginSupplier() {
  const [supplierNames, setSupplierNames] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [password, setPassword] = useState("");
  const [noSuppliers, setNoSuppliers] = useState(false);

  useEffect(() => {
    fetchSupplierNames();
  }, []);

  const fetchSupplierNames = async () => {
    try {
      const response = await api.supplierNames();
      setSupplierNames(response.data.suppliers);
      if (response.data.suppliers.length === 0) {
        setNoSuppliers(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") setSelectedSupplier(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: selectedSupplier, password };
    try {
      const response = await api.supplierSignIn(payload);
      if (response.data.accessToken) {
        localStorage.setItem("supplier", JSON.stringify(response.data));
      }
      window.location.href = "/";
    } catch (error) {
      alert(`${error.response.data.message}. Try Again!`);
    }
  };

  const handleGoBack = () => {
    api.logout();
    window.location.reload();
  };

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {noSuppliers ? (
        <p>You aren't registered with any supplier. Contact admin.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Supplier name:</label>
            <select
              className="form-control"
              id="name"
              name="name"
              value={selectedSupplier}
              onChange={handleChange}
            >
              <option value="">Select a supplier</option>
              {supplierNames.map((supplier) => (
                <option key={supplier} value={supplier}>
                  {supplier}
                </option>
              ))}
            </select>
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
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      )}
      <p className="mt-3">
        Want to go back to Login Page?{" "}
        <button className="btn btn-link p-0" onClick={handleGoBack}>
          Back
        </button>
      </p>
    </div>
  );
}

export default LoginSupplier;
