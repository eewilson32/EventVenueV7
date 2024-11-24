import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';
import { BiNetworkChart } from 'react-icons/bi';
import { CartContext } from '../CartContext';

function Tickets() {
    const { addToCart, getTicketQuantities } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();

    //const [boxTickets, setBoxTickets] = useState(0);
    //const [orchestraTickets, setOrchestraTickets] = useState(0);
    //const [mainFloorTickets, setMainFloorTickets] = useState(0);
    //const [balconyTickets, setBalconyTickets] = useState(0);
    const [ticketQuantities, setTicketQuantities] = useState({
        box: 0,
        orchestra: 0,
        mainFloor: 0,
        balcony: 0,
    });
    const [ticketPrices, setTicketPrices] = useState(null); // State to hold ticket prices
    const [eventDescription, setEventDescription] = useState(""); // State to hold event description
    const [error, setError] = useState(null); // State for error handling

   

    useEffect(() => {
        // Fetch ticket prices from the JSON file
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch ticket prices');
                }
                return response.json();
            })
            .then(data => {
                console.log('Fetched Data:', data); // Log fetched data
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (event) {
                    console.log('Selected Event:', event); // Debug selected event
                    // Assuming the ticketPrices are in the event's details
                    setEventDescription(event.description || "No description available for this event.");
                    const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                    if (eventDetail) {
                        console.log('Event Detail:', eventDetail); // Debug selected event
                        setTicketPrices(eventDetail.ticketPrices);
                        const existingQuantities = getTicketQuantities(formattedEventName, eventDate);
                        setTicketQuantities(prev => ({ ...prev, ...existingQuantities }));
                    } else {
                        setError('Event details not found for the specified date.');
                    }
                } else {
                    setError('Event not found.');
                }

                 // Fetch existing ticket quantities from cart
            const existingQuantities = getTicketQuantities(formattedEventName, eventDate);
            setTicketQuantities(prev => ({ ...prev, ...existingQuantities }));
            })
            .catch(err => {
                console.error(err);
                setError('Error fetching ticket prices.');
            });
    }, [eventName, eventDate, getTicketQuantities]);

    const handleQuantityChange = (type, quantity) => {
        setTicketQuantities(prev => ({
            ...prev,
            [type]: quantity,
        }));
    };


    const handleAddToCart = () => {
        if (!ticketPrices) return;
    
        console.log("Selected ticket quantities:", ticketQuantities); // Check the selected quantities
    
        const ticketsToAdd = Object.keys(ticketQuantities)
            .filter(type => ticketQuantities[type] > 0)
            .map(type => ({
                eventName: decodeURIComponent(eventName).replace(/-/g, ' '),
                eventDate,
                type,
                quantity: ticketQuantities[type],
                price: ticketPrices[type],
            }));
    
        console.log("Tickets to add:", ticketsToAdd); // Log the tickets being added
    
        if (ticketsToAdd.length === 0) {
            alert("Please select at least one ticket.");
            return;
        }
    
        addToCart(decodeURIComponent(eventName).replace(/-/g, ' '), eventDate, ticketsToAdd, eventDescription);
        navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
    };


        

    return (
        <div className="tickets-page">
            <h1>Select Your Tickets</h1>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Event: {eventName.replace(/-/g, ' ')} </h3>
            <p style={{ textAlign: 'left', fontStyle: 'italic', color: '#555' }}>
                {eventDescription}
            </p>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Date: {eventDate} </h3>

            {error && <p className="error">{error}</p>}

            {ticketPrices ? (
                <div>
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
                            {Object.keys(ticketPrices).map(type => (
                                <tr key={type}>
                                    <td style={{ textTransform: 'capitalize' }}>{type}</td>
                                    <td>${ticketPrices[type].toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={ticketQuantities[type]}
                                            min="0"
                                            onChange={(e) =>
                                                handleQuantityChange(type, parseInt(e.target.value) || 0)
                                            }
                                        />
                                    </td>
                                    <td>
                                        ${(
                                            ticketPrices[type] * ticketQuantities[type]
                                        ).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                            marginTop: '20px',
                        }}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            ) : (
                <p>Loading ticket prices...</p>
            )}
        </div>
    );
}

export default Tickets;