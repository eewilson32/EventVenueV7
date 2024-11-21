import React, {useEffect, useContext} from 'react';
import { PiSecurityCameraThin } from 'react-icons/pi';
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
        totalPrice = 0 // Default value if undefined
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
                        <div key={index}>
                            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                                Event: {event.eventName.replace(/-/g, ' ')}
                            </h3>
                            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                                Date: {event.eventDate}
                            </h3>
                            <ul>
                                {event.tickets.map((ticket, tIndex) => (
                                    <li key={tIndex}>
                                        {ticket.quantity} x {ticket.type} Ticket(s): ${ticket.total.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
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