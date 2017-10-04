import React, { Component } from 'react';
import './footer.css';
// Footer

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
}
export default Footer;