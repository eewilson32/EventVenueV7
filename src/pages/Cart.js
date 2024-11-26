import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';

import '../styles.css';
import { HOME_PATH } from '../App';

function Cart() {
    const { cartItems = [], addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketPrices, setTicketPrices] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});


    // Load specific event details only if eventName and eventDate are provided
    useEffect(() => {
        if (eventName && eventDate) {
            fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
                .then(response => response.json())
                .then(data => {
                    const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                    const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());
                    if (event) {
                        const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                        if (eventDetail) {
                            setTicketPrices(eventDetail.ticketPrices);
                            setEvent(event);
                        } else {
                            setError('Event details not found for the specified date.');
                        }
                    } else {
                        setError('Event not found.');
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setError('Error fetching ticket prices.');
                    setLoading(false);
                });
        } else {
            setLoading(false); // No eventName or eventDate provided; skip loading
        }
    }, [eventName, eventDate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleTicketChange = (ticketType, quantity, eventIndex) => {
        const ticketQuantity = parseInt(quantity, 10) || 0;
        const ticketPrice = ticketPrices?.[ticketType] || 0;

        // Get the event and update the ticket quantities
        const updatedCartItems = [...cartItems];
        const updatedTickets = [...updatedCartItems[eventIndex].tickets];
        const ticketIndex = updatedTickets.findIndex(ticket => ticket.type === ticketType);

        if (ticketIndex >= 0) {
            // If ticket already exists, update the quantity
            updatedTickets[ticketIndex].quantity = ticketQuantity;
        } else if (ticketQuantity > 0) {
            // If the ticket type doesn't exist, add it
            updatedTickets.push({
                type: ticketType,
                quantity: ticketQuantity,
                price: ticketPrice
            });
        }

        updatedCartItems[eventIndex].tickets = updatedTickets;

        // Update the cart context with the new tickets array
        addToCart(updatedCartItems[eventIndex].eventName, updatedCartItems[eventIndex].eventDate, updatedTickets, updatedCartItems[eventIndex].description);
    };

    const handleReadMore = (eventIndex) => {
        setExpandedDescriptions((prevState) => ({
            ...prevState,
            [eventIndex]: !prevState[eventIndex], // Toggle the expanded state for the specific event
        }));
    };


    const orderSummary = Array.isArray(cartItems) ? cartItems.map(event => {
        const tickets = event.tickets || [];
        return {
            eventName: event.eventName,
            eventDate: event.eventDate,
            tickets: tickets.map(ticket => ({
                type: ticket.type,
                quantity: ticket.quantity,
                total: ticket.quantity * ticket.price
            }))
        };
    }) : [];

    const totalPrice = Array.isArray(cartItems) ? cartItems.reduce((total, event) => {
        const tickets = event.tickets || [];
        return total + tickets.reduce((eventTotal, ticket) => {
            return eventTotal + (ticket.quantity * ticket.price);
        }, 0);
    }, 0) : 0;

    const handlePurchase = () => {
        setShowModal(true);
    };

    const confirmPurchase = () => {
        setShowModal(false);
        const eventDescription = event?.description || 'No description available.';
        navigate('/confirmation', {
            state: {
                ticketsDetails: orderSummary,
                totalTickets: cartItems.reduce((total, event) => total + event.tickets.reduce((tSum, ticket) => tSum + ticket.quantity, 0), 0),
                totalPrice,
                eventDescription: eventDescription,
                ticketPrices // Add ticketPrices to the state
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
    };
    

    return (
        <div className="cart-page">
            <div className="cart-contents">
                <h1>Your Cart</h1>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    cartItems.map((event, eventIndex) => (
                        <div key={`${event.eventName}-${eventIndex}`} className="cart-event-section">
                            {/* Event Title */}
                            <h3 className="event-title">
                                {event.eventName.replace(/-/g, ' ')}
                            </h3>

                            {/* Collapsible Description */}
                            <div
                                className={`collapsible-description ${expandedDescriptions[eventIndex] ? 'expanded' : ''
                                    }`}
                            >
                                {event.description || 'No description available for this event.'}
                            </div>
                            <span
                                className="read-more-toggle"
                                onClick={() => handleReadMore(eventIndex)}
                            >
                                {expandedDescriptions[eventIndex] ? 'Read Less' : 'Read More'}
                            </span>


                            {/* Event Details */}
                            <div className="event-details-highlight">
                                <p className="event-venue">
                                    Where: The Event Venue, 5678 Broadway Ln, XX 12345
                                </p>
                                <p className="event-date-time">
                                    When: {event.eventDate}
                                </p>
                            </div>

                            {/* Ticket Table */}
                            <table className="tickets-table">
                                <thead>
                                    <tr>
                                        <th>Ticket Type</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {["box", "orchestra", "mainFloor", "balcony"].map(type => {
                                        const ticket = event.tickets?.find(t => t.type === type) || { quantity: 0, price: ticketPrices?.[type] || 0 };
                                        return (
                                            <tr key={type}>
                                                <td>{type}</td>
                                                <td>${ticket.price.toFixed(2)}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={ticket.quantity}
                                                        onChange={(e) => handleTicketChange(type, e.target.value, eventIndex)}
                                                        className="ticket-quantity-input"
                                                    />
                                                </td>
                                                <td>${(ticket.quantity * ticket.price).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>

            {/* Fixed Footer for Total Price */}
            <div className="fixed-footer-total">
                <span className="total-label">Total Price: ${totalPrice.toFixed(2)}</span>
                <button className="cart-buttons" onClick={handlePurchase}>
                    Purchase
                </button>
                <Link to={HOME_PATH}>
                    <button className="cart-buttons">
                        Add More Tickets
                    </button>
                </Link>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Are you sure you want to purchase?</h2>
                        <div>
                            {orderSummary.map((event, index) => (
                                <div key={index}>
                                    <h3>{event.eventName} - {event.eventDate}</h3>
                                    {event.tickets.map((ticket, i) => (
                                        <p key={i}>{ticket.quantity} x {ticket.type} - ${ticket.total.toFixed(2)}</p>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <h3>Total: ${totalPrice.toFixed(2)}</h3>
                        <button onClick={closeModal}>Cancel</button>
                        <button onClick={confirmPurchase}>Yes</button>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Cart;
