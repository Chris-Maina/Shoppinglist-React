import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Navigation />
        <Footer />
      </div>
    );
  }
}

// Navigation
class Navigation extends Component {
  render() {
    return (
      <div class="header clearfix">
        <nav class="navbar navbar-default navbar-fixed-top">
          <div class="container-fluid">
            <div class="navbar-header">
              <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#main-navigation" aria-expanded="false">
                <span class="sr-only">Toggle nav</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
              <a class="navbar-brand page-scroll" href="/">Shoppinglist</a>
            </div>
            <div class="collapse navbar-collapse" id="main-navigation">
              <ul class="nav navbar-nav navbar-right">
                <li>
                  <a href="/" class="page-scroll">Home</a>
                </li>
                <li>
                  <a href="/register" class="page-scroll">Register</a>
                </li>
                <li>
                  <a href="/login" class="page-scroll">Login</a>
                </li>
                <li>
                  <a href="/shoppinglist" class="page-scroll">My Lists</a>
                </li>
                <li class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <span class="glyphicon glyphicon-user"></span>
                    <span class="glyphicon glyphicon-chevron-down"></span>
                  </a>
                  <ul class="dropdown-menu">
                    <li>
                      <div class="navbar-login row">
                        <div class="col-lg-12">
                          <p class="text-center"><a href="/logout" class="btn btn-primary btn-block">Logout</a></p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}
// Home
class Home extends Component {
  render() {
    return (
      <header>
        <div class="header-content">
          <div class="header-content-inner">
            <h1 id="homeHeading"> Shoppinglist Application </h1>
            <hr/>
              <p>Shopping list application helps you record all items you wish to buy. It allows you to record and share things you want to spend money on, meeting your needs and
				        keeping track of your shopping lists. Register to get started!!!
			      </p>
              <a href="/register" class="btn btn-primary btn-xl page-scroll" id="register"> Register </a>
		      </div>
          </div>
      </header>  
        );
  }
}
// Footer
class Footer extends Component {
          render() {
        return (
      <footer class="footer">
          <div id="footer-wrapper">
            <div id="left_navigation_links" class="nav">
              <p class="text-muted">© 2017 Chris Maina</p>
            </div>
          </div>
        </footer>
        );
  }
}
export default App;
