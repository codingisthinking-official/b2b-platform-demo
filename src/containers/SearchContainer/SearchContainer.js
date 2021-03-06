import React, { Component } from "react";
import config from "../../config";
import { withRouter } from "react-router-dom";

import AuthenticationService from "../../services/AuthenticationService";

import "./SearchContainer.css";
import ProductListComponent
  from "../../components/ProductListComponent/ProductListComponent";
import SidebarContainer from "../SidebarContainer/SidebarContainer";

class SearchContainer extends Component {
  constructor() {
    super();
    this.state = {
      'products': [],
    };
  }

  componentDidMount() {
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
      }
    };
    fetch(config.api_url + '/api/products/search?q=' + this.props.match.params.q, obj)
      .then(r => {
        r.json().then(r => {
          this.setState({
            'products': r,
          })
        });
      });
  }

  render() {
    if (0 === this.state.products.length) {
      return null;
    }

    return (
      <div className={"container--with-sidebar"}>
        <SidebarContainer />
        <ProductListComponent heading={"Result"} products={this.state.products} />
      </div>);
  }
}

export default withRouter(SearchContainer);
