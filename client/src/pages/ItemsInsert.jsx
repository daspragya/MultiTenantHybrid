import React, { Component } from "react";
import api from "../api";
import styled from "styled-components";

const Title = styled.h1.attrs({
  className: "h1",
})``;

const Wrapper = styled.div.attrs({
  className: "form-group",
})`
  margin: 0 30px;
`;

const Label = styled.label`
  margin: 5px;
`;

const InputText = styled.input.attrs({
  className: "form-control",
})`
  margin: 5px;
`;

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
`;

const CancelButton = styled.a.attrs({
  className: `btn btn-danger`,
})`
  margin: 15px 15px 15px 5px;
`;

class ItemsInsert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      desc: "",
      price: 0,
    };
  }

  handleChangeInputName = (event) => {
    const name = event.target.value;
    this.setState({ name });
  };

  handleChangeInputDescription = (event) => {
    const desc = event.target.value;
    this.setState({ desc });
  };

  handleChangeInputPrice = (event) => {
    const price = event.target.value;
    this.setState({ price });
  };

  handleIncludeItem = async () => {
    const { name, desc, price } = this.state;

    try {
      const payload = { name, desc, price };
      await api.insertItem(payload);
      window.alert("Item inserted successfully");
      this.setState({
        name: "",
        desc: "",
        price: 0,
      });
    } catch (error) {
      console.log(error);
      window.alert("Error inserting task");
    }
  };

  render() {
    const { name, desc, price } = this.state;
    return (
      <Wrapper>
        <Title>Create Item</Title>

        <Label>Name: </Label>
        <InputText
          type="text"
          value={name}
          onChange={this.handleChangeInputName}
        />

        <Label>Description: </Label>
        <InputText
          type="text"
          value={desc}
          onChange={this.handleChangeInputDescription}
        />

        <Label>Price: </Label>
        <InputText
          type="number"
          value={price}
          onChange={this.handleChangeInputPrice}
        />

        <Button onClick={this.handleIncludeItem}>Add Item</Button>
        <CancelButton href={"/items/list"}>Cancel</CancelButton>
      </Wrapper>
    );
  }
}

export default ItemsInsert;
