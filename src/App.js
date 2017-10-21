import React, { Component } from 'react';
import { Route} from 'react-router-dom';
/** Import all pages components */
import RegisterPage from './components/register';
import LoginPage from './components/login';
import ShoppinglistPage from './components/shoppinglist';
import ShoppingItemsPage from './components/shoppingitem';
import Home from './components/home';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        {/* Entry point App
            Define path for the other pages:
            Register, Login, Shopping list, Shopping items
          */}

        <Route exact={true} path="/" component={Home} />
        <Route path="/auth/register/" component={RegisterPage} />
        <Route path="/auth/login/" component={LoginPage} />
        <Route path="/shoppinglist/" component={ShoppinglistPage} />
        <Route path="/items/:id" component={ShoppingItemsPage} />
      </div>
    );
  }
}
export default App;
