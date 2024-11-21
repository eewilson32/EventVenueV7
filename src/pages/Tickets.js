import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';
import { BiNetworkChart } from 'react-icons/bi';
import { CartContext } from '../CartContext';

function Tickets() {
    const { addToCart, getTicketQuantities } = useContext(CartContext);
    const navigate = useNavigate();
    const { eventName, eventDate } = useParams();

    const [boxTickets, setBoxTickets] = useState(0);
    const [orchestraTickets, setOrchestraTickets] = useState(0);
    const [mainFloorTickets, setMainFloorTickets] = useState(0);
    const [balconyTickets, setBalconyTickets] = useState(0);
    const [ticketQuantities, setTicketQuantities] = useState({
        box: 0,
        orchestra: 0,
        mainFloor: 0,
        balcony: 0,
    });
    const [ticketPrices, setTicketPrices] = useState(null); // State to hold ticket prices
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
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const event = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (event) {
                    // Assuming the ticketPrices are in the event's details
                    const eventDetail = event.eventDetails.find(detail => detail.date === eventDate);
                    if (eventDetail) {
                        setTicketPrices(eventDetail.ticketPrices);
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
    
        addToCart(decodeURIComponent(eventName).replace(/-/g, ' '), eventDate, ticketsToAdd);
        navigate(`/cart/${encodeURIComponent(eventName)}/${encodeURIComponent(eventDate)}`);
    };


        

    return (
        <div className="tickets-page">
            <h1>Select Your Tickets</h1>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Event: {eventName.replace(/-/g, ' ')} </h3>
            <h3 style={{ textTransform: 'capitalize', textAlign: 'left' }}>
                Date: {eventDate} </h3>

            {error && <p className="error">{error}</p>}

            {ticketPrices ? (
                <>
                    <div className="ticket-option">
                        <label>Box Tickets (${ticketPrices.box.toFixed(2)} each):</label>
                        <select value={ticketQuantities.box} onChange={(e) => handleQuantityChange('box', Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Orchestra Tickets (${ticketPrices.orchestra.toFixed(2)} each):</label>
                        <select value={ticketQuantities.orchestra} onChange={(e) => handleQuantityChange('orchestra', Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Main Floor Tickets (${ticketPrices.mainFloor.toFixed(2)} each):</label>
                        <select value={ticketQuantities.mainFloor} onChange={(e) => handleQuantityChange('mainFloor', Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

                    <div className="ticket-option">
                        <label>Balcony Tickets (${ticketPrices.balcony.toFixed(2)} each):</label>
                        <select value={ticketQuantities.balcony} onChange={(e) => handleQuantityChange('balcony', Number(e.target.value))}>
                            {[...Array(11).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </div>
                    <br />

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
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </>
            ) : (
                <p>Loading ticket prices...</p>
            )}
        </div>
    );
}

export default Tickets;
