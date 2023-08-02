import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { logout, switchTenant } from "../api";

function Links() {
  const tenantName = localStorage.getItem("tenantName");
  const [userTenants, setUserTenants] = useState(
    JSON.parse(localStorage.getItem("userTenants")) || []
  );
  const [currentTenant, setCurrentTenant] = useState(tenantName);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    setCurrentTenant(tenantName);
  }, [tenantName]);

  const handleLogout = async () => {
    if (window.confirm("Do you want to Logout?")) {
      await logout()
        .then((res) => {
          localStorage.removeItem("tenantName");
          localStorage.removeItem("userTenants");
          alert("Logged out!");
          window.location.href = "/";
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleDropdownToggle = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleTenantSwitch = async (tenant) => {
    const previousTenant = currentTenant;
    setCurrentTenant(tenant);
    const payload = { tenantName: tenant };
    await switchTenant(payload)
      .then((res) => {
        localStorage.setItem("tenantName", tenant);
        alert("Tenant switched successfully!");
        if (previousTenant !== tenant) {
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Failed to switch tenant");
      });
  };
  const filteredTenants = userTenants.filter(
    (tenant) => tenant !== currentTenant
  );
  return (
    <React.Fragment>
      <Link to="/" className="navbar-brand">
        {tenantName.toUpperCase()}
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/items/list" className="nav-link">
              List All Items
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/items/create" className="nav-link">
              Create an Item
            </Link>
          </li>
          {userTenants.length > 1 && (
            <li
              className={`nav-item dropdown ${dropdownVisible ? "show" : ""}`}
              onClick={handleDropdownToggle}
            >
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="tenantDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={dropdownVisible ? "true" : "false"}
              >
                Switch Tenant
              </a>
              <div
                className={`dropdown-menu ${dropdownVisible ? "show" : ""}`}
                aria-labelledby="tenantDropdown"
              >
                {filteredTenants.map((tenant, index) => (
                  <button
                    key={index}
                    className="dropdown-item"
                    onClick={() => handleTenantSwitch(tenant)}
                  >
                    {tenant}
                  </button>
                ))}
              </div>
            </li>
          )}
          <li className="nav-item">
            <Link to="#" className="nav-link" onClick={handleLogout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
}

export default Links;
