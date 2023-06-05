import React, { Component } from "react";
import styled from "styled-components";

const Container = styled.div.attrs({
  className: "container",
})``;

const WelcomeMessage = styled.div`
  text-align: center;
  margin-top: 100px;
  font-size: 24px;
`;

class FirstPage extends Component {
  render() {
    return (
      <Container>
        <WelcomeMessage>
          Welcome to Supplier Hub! Use the navigation bar to manage your items.
        </WelcomeMessage>
      </Container>
    );
  }
}

export default FirstPage;
