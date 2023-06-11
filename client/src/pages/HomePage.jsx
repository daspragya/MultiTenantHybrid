import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div.attrs({
  className: "container",
})``;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
  margin-bottom: 20px;
`;

const SupplierInfo = styled.div`
  font-size: 18px;
  margin-top: 20px;
`;

class FirstPage extends Component {
  render() {
    const supplier = JSON.parse(localStorage.getItem("supplier"));
    console.log(supplier);
    return (
      <Container className="container">
        <WelcomeMessage>
          Welcome to Supplier Hub! Use the navigation bar to manage your items.
        </WelcomeMessage>
        <SupplierInfo>You are registered with the supplier:</SupplierInfo>
        <SupplierInfo>Name: {supplier.name}</SupplierInfo>
        <SupplierInfo>Description: {supplier.desc}</SupplierInfo>
      </Container>
    );
  }
}

export default FirstPage;
