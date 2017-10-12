import React, { Component } from 'react';
import { Navbar, NavItem} from 'react-materialize';
// Navigation bar
class Navigation extends Component {
  render() {
    return (
      <div>
        <Navbar brand='SHOPPINGLIST' right>
          <NavItem >Home</NavItem>
          <NavItem>Register</NavItem>
          <NavItem href='/auth/login/'>Login</NavItem>
          <NavItem href='/shoppinglist'>My Lists</NavItem>
        </Navbar>
      </div>
    );
  }
}
export default Navigation;