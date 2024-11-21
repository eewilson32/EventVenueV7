import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CartContext } from '../CartContext';
import '../styles.css';
import { HOME_PATH } from '../App';

function Cart() {
    const { cartItems, addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketPrices, setTicketPrices] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
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
    }, [eventName, eventDate]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    const handleTicketChange = (ticketType, quantity, eventIndex) => {
        const ticketQuantity = parseInt(quantity, 10) || 0;
        const updatedCart = [...cartItems];
        const eventInCart = updatedCart.find(event => event.eventName === eventName && event.eventDate === eventDate);

        if (eventInCart) {
            const ticketIndex = eventInCart.tickets.findIndex(t => t.type === ticketType);
            if (ticketQuantity > 0) {
                if (ticketIndex === -1) {
                    eventInCart.tickets.push({
                        type: ticketType,
                        quantity: ticketQuantity,
                        price: ticketPrices[ticketType]
                    });
                } else {
                    eventInCart.tickets[ticketIndex].quantity = ticketQuantity;
                }
            } else if (ticketIndex !== -1) {
                eventInCart.tickets.splice(ticketIndex, 1);
            }
        } else {
            updatedCart.push({
                eventName,
                eventDate,
                tickets: [
                    {
                        type: ticketType,
                        quantity: ticketQuantity,
                        price: ticketPrices[ticketType]
                    }
                ]
            });
        }
        addToCart(updatedCart);
    };

    const orderSummary = cartItems.map(event => ({
        eventName: event.eventName,
        eventDate: event.eventDate,
        tickets: event.tickets.map(ticket => ({
            type: ticket.type,
            quantity: ticket.quantity,
            total: ticket.quantity * ticket.price
        }))
    }));

    const totalPrice = cartItems.reduce((total, event) => {
        return total + event.tickets.reduce((eventTotal, ticket) => {
            return eventTotal + (ticket.quantity * ticket.price);
        }, 0);
    }, 0);

    const handlePurchase = () => {
        setShowModal(true);
    };

    const confirmPurchase = () => {
        setShowModal(false);
        navigate('/confirmation', {
            state: {
                ticketsDetails: orderSummary,
                totalTickets: cartItems.reduce((total, event) => total + event.tickets.reduce((tSum, ticket) => tSum + ticket.quantity, 0), 0),
                totalPrice
            }
        });
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                cartItems.map((event, eventIndex) => (
                    <div key={`${event.eventName}-${eventIndex}`}>
                        <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                            Event: {event.eventName.replace(/-/g, ' ')}
                        </h3>
                        <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                            Date: {eventDate}
                        </h3>
                        {["box", "orchestra", "mainFloor", "balcony"].map(type => (
                            <div key={type} className="ticket-selection" style={{ marginBottom: '15px' }}>
                                <label>{`${type.charAt(0).toUpperCase() + type.slice(1)} Tickets:`}</label>
                                <select
                                    value={event.tickets.find(t => t.type === type)?.quantity || 0}
                                    onChange={(e) => handleTicketChange(type, e.target.value, eventIndex)}
                                >
                                    {[...Array(11).keys()].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                        <br />
                    </div>
                ))
            )}
            <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        backgroundColor: '#FF6700',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={handlePurchase}
                >
                    Purchase
                </button>
                <Link to={HOME_PATH}>
                    <button
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#FF6700',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        Add More Tickets
                    </button>
                </Link>
            </div>

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
