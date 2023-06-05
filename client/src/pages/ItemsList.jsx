import React, { Component } from "react";
import styled from "styled-components";

import api from "../api";
import "./Table.css";

const Update = styled.div`
  color: #ef9b0f;
  cursor: pointer;
`;

const Delete = styled.div`
  color: #ff0000;
  cursor: pointer;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 18px;
  color: #999;
`;

class UpdateItem extends Component {
  updateUser = (event) => {
    event.preventDefault();

    window.location.href = `/items/update/${this.props.id}`;
  };

  render() {
    return <Update onClick={this.updateUser}>Update</Update>;
  }
}

class DeleteItem extends Component {
  deleteUser = (event) => {
    event.preventDefault();

    if (
      window.confirm(
        `Do you want to delete the task ${this.props.name} permanently?`
      )
    ) {
      api.deleteItemById(this.props.id);
      window.location.reload();
    }
  };

  render() {
    return <Delete onClick={this.deleteUser}>Delete</Delete>;
  }
}

class ItemsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      columns: [],
      isLoading: false,
    };
  }
  componentDidMount = async () => {
    this.setState({ isLoading: true });
    await api
      .getAllItems()
      .then((items) => {
        console.log(items);
        this.setState({
          items: items.data.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };
  render() {
    const { items } = this.state;
    if (items.length !== 0) {
      return (
        <div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Delete</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.desc}</td>
                  <td>{item.price}</td>
                  <td>
                    <DeleteItem id={item._id} name={item.name} />
                  </td>
                  <td>
                    <UpdateItem id={item._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div>
          <Message>No Tasks</Message>
        </div>
      );
    }
  }
}

export default ItemsList;
