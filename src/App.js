import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from "react-bootstrap/Container";

import Header from "./components/HeaderComponent/Header";
import AuthenticationService from "./services/AuthenticationService";

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import NavMenuComponent from "./components/NavMenuComponent/NavMenuComponent";
import FooterComponent from "./components/FooterComponent/FooterComponent";
import HomepageContainer
  from "./containers/HomepageContainer/HomepageContainer";
import Login from "./containers/LoginContainer/Login";
import ProductContainer from "./containers/ProductContainer/ProductContainer";
import config from "./config";
import SearchContainer from "./containers/SearchContainer/SearchContainer";
import ManageProductsContainer from "./containers/ManageProductsContainer/ManageProductsContainer";
import SubAccountsContainer
  from "./containers/SubAccountsContainer/SubAccountsContainer";
import CategoryProducts
  from "./containers/CategoryProductsContainer/CategoryProducts";
import SliderContainer from "./containers/SliderContainer/SliderContainer";
import StaticPageContainer
  from "./containers/StaticPageContainer/StaticPageContainer";
import CartContainer from "./containers/CartContainer/CartContainer";

class App extends React.Component {
  render() {
    let context = null;
    let loggedRouter = null;
    let footerComponent = null;
    let sliderContainer = null;

    if (!AuthenticationService.isAuthenticated()) {
      context = <Login />;
    } else {
      const obj = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + AuthenticationService.getJwtToken()
        }
      };
      fetch(config.api_url + '/api/account/current/', obj)
        .then(resp => {
          resp.json().then(r => {
            if (!resp.ok) {
              AuthenticationService.logout();
              window.location.href = '/';
            }
          });
        });

      sliderContainer = <SliderContainer />;
      footerComponent = <FooterComponent />;
      loggedRouter = (<Router>
        <Switch>
          <Route path="/manage/products/">
            <NavMenuComponent/>
            <ManageProductsContainer />
          </Route>
          <Route path="/manage/subAccounts/">
            <NavMenuComponent/>
            <SubAccountsContainer />
          </Route>
          <Route path="/products/search/:q/">
            <NavMenuComponent/>
            <SearchContainer />
          </Route>
          <Route path="/product/:productId/">
            <NavMenuComponent/>
            <ProductContainer />
          </Route>
          <Route path="/category/:category/">
            <NavMenuComponent/>
            <CategoryProducts />
          </Route>
          <Route path="/profile/invoices/">
            <NavMenuComponent/>
            <StaticPageContainer heading={"Moje faktury"} text={"Nie wystawiono żadnych faktur."} />
            <CategoryProducts />
          </Route>
          <Route path="/profile/orders/">
            <NavMenuComponent/>
            <StaticPageContainer heading={"Moje zamówienia"} text={"Jeszcze nic nie zamówiłeś."} />
            <CategoryProducts />
          </Route>
          <Route path="/cart/">
            <NavMenuComponent/>
            <CartContainer />
            <CategoryProducts />
          </Route>
          <Route path="/">
            <NavMenuComponent/>
            <HomepageContainer />
          </Route>
        </Switch>
      </Router>);
    }

    return (
      <div className="full-container">
        <Header />
        {sliderContainer}
        <Container className={"container__main"}>
          {context}
          {loggedRouter}
        </Container>
        {footerComponent}
      </div>
    );
  }
}

export default App;
