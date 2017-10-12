import React, { Component } from 'react';
import { Button } from 'react-materialize';
import Footer from './footer';
import './home.css';

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
              <Button waves='orange' node='a' href='/auth/register/' className="btn-primary" id="register"> Register</Button>
            </div>
          </div>
          <Footer />
        </header>
      </div>
    );
  }
}
export default Home;