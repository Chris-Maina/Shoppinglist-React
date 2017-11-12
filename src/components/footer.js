import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">
          <div id="left_navigation_links" className="nav">
            <p className="text-muted">© 2017 Chris Maina</p>
          </div>
      </footer>
    );
  }
}
export default Footer;