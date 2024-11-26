import React, { useContext } from 'react';
import '../styles.css';
import { Link } from 'react-router-dom';
import { CartContext } from '../CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Import cart icon
import { IoTicketSharp } from "react-icons/io5"; // Import the Ticket icon

function Header({ navigationHistory }) {
    const { cartItems } = useContext(CartContext); // Access cart items

    // Calculate total item count
    const itemCount = cartItems.length; // Count unique events


    return (
        <header>
            <nav>
                <ul className="menu">
                    <li><Link to="/EventVenueV7">Home</Link></li>
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
                    <li className="dropdown">
                        <a href="#">Find More Information</a>
                        <ul className="dropdown-menu">
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Support</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Directions</a></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a href="#">Account</a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Sign-Up/Login</a></li>
                            <li><a href="#">Saved Events</a></li>
                            <li><a href="#">Purchase History</a></li>
                        </ul>
                    </li>
                    {/* Add cart icon */}
                    <li className="cart-icon">
                        <Link to="/cart">
                            <FaShoppingCart className="cart" />
                            {itemCount > 0 && (
                                <span className="cart-count">
                                    <IoTicketSharp className="ticket-icon" />
                                    <span className="item-count">{itemCount}</span>
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;