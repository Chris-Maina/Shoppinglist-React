import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Navbar, NavItem , Dropdown} from 'react-materialize';
// Navigation bar
export class Navigation extends Component {
  constructor(props){
    super(props);
    this.state = {redirect: false};
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }
  handleLogoutClick(){
    window.localStorage.removeItem('token');
    this.setState({redirect: true});
  }
  render() {
    if(this.state.redirect){
      return(
        <Redirect to="/auth/login/"/>
      );
    }
    return (
      <div>
        <Navbar brand='SHOPPINGLIST' right>
        <NavItem href='/auth/register/'>Register</NavItem>
        <NavItem href='/auth/login/'>Login</NavItem>
          <NavItem href='/shoppinglists/'>My Lists</NavItem>
          <Dropdown trigger={
            <NavItem >User</NavItem>
          }>
            <NavItem href='/user'>Profile</NavItem>
            <NavItem  onClick={this.handleLogoutClick}>logout</NavItem>
          </Dropdown>
        </Navbar>
      </div>
    );
  }
}
