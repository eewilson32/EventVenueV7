import React, { useState, useEffect } from 'react';
import '../styles.css';
import { Link, useLocation } from 'react-router-dom'; // If you're using react-router for navigation

function Header({ navigationHistory }) {


  return (
    <header>
      <nav>
        <ul className="menu">
          <li><Link to="/EventVenueV7">Home</Link></li>

          {/* Dropdown for "Find Events" */}
          <li className="dropdown">
            <a href="#">Find Events</a>
            <ul className="dropdown-menu">
              <li><Link to="/events/musicals">Find Musicals</Link></li>
              <li><Link to="/events/plays">Find Plays</Link></li>
              <li><Link to="/events/operas">Find Operas</Link></li>
              <li><Link to="/events/ballets">Find Ballet</Link></li>
              <li><Link to="/events/concerts">Find Concerts</Link></li>
            </ul>
          </li>

          {/* Dropdown for "More Information" */}
          <li className="dropdown">
            <a href="#">Find More Information</a>
            <ul className="dropdown-menu">
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Directions</a></li>
            </ul>
          </li>

          {/* Dropdown for "Account" */}
          <li className="dropdown">
            <a href="#">Account</a>
            <ul className="dropdown-menu">
              <li><a href="#">Sign-Up/Login</a></li>
              <li><a href="#">Saved Events</a></li>
              <li><a href="#">Your Cart</a></li>
              <li><a href="#">Purchase History</a></li>
            </ul>
          </li>
        </ul>



      </nav>

    </header>
  );
}

export default Header;
