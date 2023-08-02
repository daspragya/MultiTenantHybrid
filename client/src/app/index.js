import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { NavBar } from "../components";
import { ItemsList, ItemsInsert, ItemsUpdate, HomePage, Login } from "../pages";
import { getCurrentUser } from "../api";
const CenteredMessage = styled.p`
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
`;

function App() {
  const [signed, setSigned] = useState(null);

  useEffect(() => {
    const fetchSignedStatus = async () => {
      try {
        const status = getCurrentUser();
        setSigned(status);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSignedStatus();
  }, []);

  return (
    <Router>
      <React.Fragment>
        {signed && <NavBar />}
        <div className="container">
          <Routes>
            {signed ? (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/items/list" element={<ItemsList />} />
                <Route path="/items/create" element={<ItemsInsert />} />
                <Route path="/items/update/:id" element={<ItemsUpdate />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Login />} />
              </>
            )}
            <Route
              path="*"
              element={<CenteredMessage>404 - Page not found</CenteredMessage>}
            />
          </Routes>
        </div>
      </React.Fragment>
    </Router>
  );
}

export default App;
