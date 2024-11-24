import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../CartContext';

function PurchaseConfirmation() {
    const location = useLocation();
    const { resetCart } = useContext(CartContext); 

    // Destructure the data from state
    const { state } = location;
    console.log(state);
    const {
        ticketsDetails = [], // This will hold details of each event
        totalTickets = 0, // Default value if undefined
        totalPrice = 0,// Default value if undefined
        eventDescription = '', // Default to empty string if not found
        ticketPrices = {} // Add ticketPrices here
    } = state || {};

    // Clear the cart when the component mounts
    useEffect(() => {
        resetCart();  // Clear cart from local storage
    }, [resetCart]);

    return (
        <div className="confirmation-page">
            <h1>Purchase Confirmation</h1>
            {ticketsDetails.length > 0 ? (
                <div>
                    {ticketsDetails.map((event, index) => (
                        <div key={index} className="event-details">
                            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                                Event: {event.eventName.replace(/-/g, ' ')}
                            </h3>

                            {/* Display Event Description */}
                            <p style={{ textAlign: 'left', fontStyle: 'italic', color: '#555' }}>
                                {eventDescription || 'No description available for this event.'}
                            </p>

                            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                                Date: {event.eventDate}
                            </h3>

                            {/* Ticket Details Table */}
                            <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Ticket Type</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Cost per Ticket</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {event.tickets.map((ticket, tIndex) => {
                                    const ticketPrice = ticketPrices[ticket.type]; // Get the price for the specific ticket type

                                    return (
                                        <tr key={tIndex}>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.type}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{ticket.quantity}</td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                ${ticketPrice ? ticketPrice.toFixed(2) : 'N/A'}  {/* Display cost per ticket */}
                                            </td>
                                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                ${ticketPrice ? (ticket.quantity * ticketPrice).toFixed(2) : 'N/A'}  {/* Display total cost */}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                            <br />
                        </div>
                    ))}
                    <p><strong>Total Tickets: {totalTickets}</strong></p>
                    <h2>Total Price: ${totalPrice.toFixed(2)}</h2>
                    <button
                        style={{
                            display: 'block',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            backgroundColor: '#FF6700',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                        onClick={() => window.location.href = '/EventVenueV7'}
                    >
                        Return to Home
                    </button>
                </div>
            ) : (
                <p>No purchase data available.</p>
            )}
        </div>
    );
}

export default PurchaseConfirmation;
