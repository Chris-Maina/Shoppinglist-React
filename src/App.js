import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';
/** Import all pages components */
import { RegisterPage } from './components/register';
import { LoginForm } from './components/login';
import {ShoppinglistPage }from './components/shoppinglist';
import Home from './components/home';
import {ShoppingItemsPage} from './components/shoppingitem';
import UserProfile from './components/user_profile';
import ForgotPassword from './components/forgot_password';
import SubmitPassword from './components/submit_password';
import requireLogin from './components/authenticate';
import NoContent from './components/nocontent';
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
        <Route exact={true} path="/user/reset" component={ForgotPassword} />
        <Route exact={true} path={`/user/reset/password/:token`} component={SubmitPassword} />
        <Route path="/auth/register/" component={RegisterPage} />
        <Route path="/auth/login/" component={LoginForm} />
        <Route exact={true} path="/user" component={requireLogin(UserProfile)} />
        <Route exact ={true} path="/shoppinglists/" component={requireLogin(ShoppinglistPage)} />
        <Route exact ={true} path={`/shoppinglists/:sl_id/items`} component={requireLogin(ShoppingItemsPage)} />
        <Route exact ={true} path="*" component={NoContent}/>
        </Switch>
      </div>
    );
  }
}
export default App;
