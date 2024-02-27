import React, { Component } from "react";
import axios from "axios";
import { SERVER_HOST } from "../config/global_constants";
import Nav from "./Nav";
import Footer from "./Footer";
import "../css/ProductPage.css";
import BuyProduct from "./BuyProduct";

export default class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product: [],
      quantity: 1,
      item_price: 0,
      total: 0,
      loading: true,
    };
  }

  handleClick = (e) => {
    e.target.classList.toggle("active");

    var content = e.target.nextElementSibling;

    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  validateQuantity() {
    const quantity = parseInt(this.state.quantity);
    return quantity >= 1 && quantity <= 100;
  }

  componentDidMount() {
    axios
      .get(`${SERVER_HOST}/products/${this.props.match.params.id}`, {
        headers: { authorization: localStorage.token },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            this.setState({ product: res.data });
            console.log("Succesful Request");
          }
        } else {
          console.log("Record not found");
        }
      });
  }
  componentDidUpdate(prevState) {
    /* On initial render the product.photos state isn't loaded
    So using componentDidUpdate we can make the request to 
    get the photo using filename after the state is actually updated*/
    if (this.state.product !== prevState.product) {
      this.state.product.photos.map((photo) => {
        return axios
          .get(`${SERVER_HOST}/products/photo/${photo.filename}`)
          .then((res) => {
            if (res.data) {
              if (res.data.errorMessage) {
                console.log(res.data.errorMessage);
              } else {
                document.getElementById(
                  photo._id
                ).src = `data:;base64,${res.data.image}`;
              }
            } else {
              console.log("Record not found");
            }
          });
      });
    }
  }

  handleATC = (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("productId", this.state.product._id);
    formData.append("userId", localStorage._id);
    formData.append("quantity", 1);
    formData.append("productPrice", this.state.product.price);

    axios
      .post(`${SERVER_HOST}/cart`, formData, {
        headers: {
          authorization: localStorage.token,
          "Content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data) {
          if (res.data.errorMessage) {
            console.log(res.data.errorMessage);
          } else {
            console.log(res.data);
            console.log("Added to cart");
          }
        } else {
          console.log("Not added to cart");
        }
      });
  };

  render() {
    return (
      <div className="main-container">
        <Nav />

        <div className="content-container">
          <div className="left-container">
            {this.state.product.photos &&
              this.state.product.photos.length > 0 &&
              this.state.product.photos.map((photo, index) => (
                <img
                  className={`main-image-${index}`}
                  key={photo._id}
                  id={photo._id}
                  alt=""
                />
              ))}
          </div>
          <div className="right-container">
            <div className="title-container">
              <h1>{this.state.product.name}</h1>
              <h3>${this.state.product.price}</h3>
            </div>
            <div className="description-container">
              <p>This is the product description</p>

              <h3>Quantity</h3>
              <input
                className="quantity"
                type="number"
                name="quantity"
                min="1"
                max="100"
                onChange={this.handleChange}
                value={this.state.quantity}
              />

              <button className="collapsible" onClick={this.handleClick}>
                Open Section 1
              </button>
              <div className="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <button className="collapsible" onClick={this.handleClick}>
                Open Section 2
              </button>
              <div className="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <button className="collapsible" onClick={this.handleClick}>
                Open Section 3
              </button>
              <div className="content">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {this.state.product.stock > 0 ? (
                <div className="buying-buttons">
                  <button
                    className="product-page-atc-button"
                    onClick={this.handleATC}
                  >
                    <p>
                      Add To Cart +<i className="fa fa-shopping-cart" />
                    </p>
                  </button>
                  <div className="paypal-buy-button">
                    <BuyProduct
                      price={this.state.product.price * this.state.quantity}
                      productId={this.state.product._id}
                      quantity={this.state.quantity}
                    />
                  </div>
                </div>
              ) : (
                <p>Sorry this item is out of stock</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
