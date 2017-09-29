import React, { Component } from 'react';
import { Navbar, NavItem, Button } from 'react-materialize';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import RegisterPage from './components/register';
import LoginPage from './components/login';
import ShoppinglistPage from './components/shoppinglist';
import ShoppingItemsPage from './components/shoppingitem';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
      </div>
    );
  }
}

// Navigation
class Navigation extends Component {
  render() {
    return (
      <Router>
        <Navbar brand='SHOPPINGLIST' right>
          <NavItem href='/'>Home</NavItem>
          <NavItem href='/auth/register/'>Register</NavItem>
          <NavItem href='/auth/login/'>Login</NavItem>
          <NavItem href='/shoppinglist'>My Lists</NavItem>
          {/* Define path for the other pages:
            Register, Login, Buckets, Activities
          
          */}
          <Route exact path="/" component={Home} />
          <Route path="/auth/register/" component={RegisterPage} />
          <Route path="/auth/login/" component={LoginPage} />
          <Route path="/shoppinglist/" component={ShoppinglistPage}/>
          <Route path="/shoppingitem" component={ShoppingItemsPage}/>
        </Navbar>
      </Router>
    );
  }
}
// Home
class Home extends Component {
  render() {
    return (
      <div>
      <header>
        <div className="header-content">
          <div className="header-content-inner">
            <h1 id="homeHeading"> Shoppinglist Application </h1>
            <hr />
            <p>Shopping list application helps you record all items you wish to buy. It allows you to record and share things you want to spend money on, meeting your needs and
				        keeping track of your shopping lists. Register to get started!!!
			      </p>
            <Button waves='orange' node='a' href="/auth/register/" className="btn-primary" id="register"> Register </Button>
          </div>
        </div>
      </header>
      </div>
    );
  }
}

// Footer
{/*
class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div id="footer-wrapper">
          <div id="left_navigation_links" className="nav">
            <p className="text-muted">© 2017 Chris Maina</p>
          </div>
        </div>
      </footer>
    );
  }
}*/}
export default App;
