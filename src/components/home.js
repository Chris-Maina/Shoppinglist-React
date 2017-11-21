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
              <p>Shopping list application helps you create, edit or delete shopping list. It allows you to record things or items you want to spend money on, meeting your needs and
				        keeping track of your shopping lists.
			      </p>
            <div>
            <a href="/auth/register/"><Button className="btn-primary amber accent-4"> Register</Button></a>
            <a href="/auth/login/">  <Button className="btn-primary amber accent-4" >Login</Button></a>
            </div>
            </div>
          </div>
        </header>
        <Footer />
      </div>
    );
  }
}
export default Home;