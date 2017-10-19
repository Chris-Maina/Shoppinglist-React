import React, { Component } from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

/** Import all pages components */
import RegisterPage from './register';
import LoginPage from './login';
import ShoppinglistPage from './shoppinglist';
import ShoppingItemsPage from './shoppingitem';
import Home from './home';
import history from './history';
// Navigation
class NavRoutes extends Component {
  render() {
    return (
      <BrowserRouter history={history}>
           {/* Define path for the other pages:
            Register, Login, Shopping list, Shopping items
          */}
          <div>
          <Route exact path="/" component={Home} />
          <Route path="/auth/register/" component={RegisterPage} />
          <Route path="/auth/login/" component={LoginPage} />
          <Route path="/shoppinglist/" component={ShoppinglistPage}/>
          <Route path="/items/:id" component={ShoppingItemsPage}/>
          </div>
      </BrowserRouter>
    );
  }
}
export default NavRoutes;