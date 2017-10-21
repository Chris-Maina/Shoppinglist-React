import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';
/** Import all pages components */
import RegisterPage from './components/register';
import LoginPage from './components/login';
import ShoppinglistPage from './components/shoppinglist';
import Home from './components/home';
import ShoppingItemsPage from './components/shoppingitem';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {/* Entry point App
            Define path for the other pages:
            Register, Login, Shopping list, Shopping items
          */}
        <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route path="/auth/register/" component={RegisterPage} />
        <Route path="/auth/login/" component={LoginPage} />
        <Route exact ={true} path="/shoppinglists/" component={ShoppinglistPage} />
        <Route path={`/shoppinglists/:sl_id/items`} component={ShoppingItemsPage} />
        </Switch>
      </div>
    );
  }
}
export default App;
