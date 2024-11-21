import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { HOME_PATH } from '../App';
import { CartContext } from '../CartContext';

function EventPage() {
    const { eventName, eventDate } = useParams();
    const { addToCart } = useContext(CartContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [buttonText, setButtonText] = useState('Save Event');

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => response.ok ? response.json() : Promise.reject('Failed to fetch data'))
            .then(data => {
                const formattedEventName = decodeURIComponent(eventName).replace(/-/g, ' ');
                const foundEvent = data.events.find(e => e.eventName.toLowerCase() === formattedEventName.toLowerCase());

                if (foundEvent) {
                    setEvent(foundEvent);
                    setSelectedDate(foundEvent.eventDetails[0].date);  // Default to the first date available
                } else {
                    setError('Event not found.');
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching event data:', err);
                setError('Error fetching event data.');
                setLoading(false);
            });
    }, [eventName]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const getPricesForDate = (date) => {
        const eventDetail = event.eventDetails.find(detail => detail.date === date);
        return eventDetail ? eventDetail.ticketPrices : {};
    };

    const handleDateChange = (date) => {
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const ticketPrices = getPricesForDate(selectedDate);

    const getDateRange = (details) => {
        const sortedDates = details.map(detail => new Date(detail.date)).sort((a, b) => a - b);
        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];
        return `${startDate.toDateString()} - ${endDate.toDateString()}`;
    };

    const dateRange = getDateRange(event.eventDetails);

    const tileClassName = ({ date }) => {
        const eventDates = event.eventDetails.map(detail => detail.date);
        return eventDates.includes(date.toISOString().split('T')[0]) ? 'highlight' : null;
    };

    const tileDisabled = ({ date }) => {
        const eventDates = event.eventDetails.map(detail => detail.date);
        return !eventDates.includes(date.toISOString().split('T')[0]);
    };



    const handleTicketChange = (ticketType, quantity) => {
        const ticketQuantity = parseInt(quantity, 10) || 0;

        // Create tickets array based on selected quantity
        const tickets = [
            {
                type: ticketType,
                quantity: ticketQuantity,
                price: event.ticketPrices[ticketType], // Assume you have ticket prices available
            },
        ];

        // Add or update the cart
        addToCart(event.eventName, selectedDate, tickets);
    };


    return (
        <div className="event-page">
            <div className="event-banner" style={{ backgroundImage: 'url("/path-to-banner-image.jpg")' }}>
                <div className="overlay">
                    <h1>{event.eventName}</h1>
                    <p>{dateRange} | {event.eventDetails[0].time}</p>
                </div>
            </div>

            <div className="content-grid">
                {/* Left column with "Go Back" button and event content */}
                <div className="left-column">
                    {/* Go Back button */}
                    <div className="top-left-button">
                        <Link to={HOME_PATH} className="go-back-button">Go Back</Link>
                    </div>

                    <div className="event-details">
                        <section className="event-info">
                            <h3>Description</h3>
                            <p>{event.description}</p>

                            <h3>Time</h3>
                            <p>{event.eventDetails[0].time}</p>
                        </section>

                        {/* Ticket Prices and Calendar in the bottom section */}
                        <div className="bottom-section">
                            <div className="calendar-section">
                                <h3>Event Calendar</h3>
                                <Calendar
                                    tileClassName={tileClassName}
                                    tileDisabled={tileDisabled}
                                    onClickDay={handleDateChange}
                                    defaultValue={
                                        new Date(Date.UTC(
                                            selectedDate.split('-')[0],
                                            selectedDate.split('-')[1] - 1,
                                            selectedDate.split('-')[2],
                                            12, 0, 0
                                        ))
                                    }
                                />
                            </div>
                            <table className="ticket-prices-table">
                                <thead>
                                    <tr>
                                        <th>Section</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(ticketPrices).map(([section, price]) => (
                                        <tr key={section}>
                                            <td>{section}</td>
                                            <td>${price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

                {/* Right column for the button group */}
                <div className="right-column">
                    <div className="top-right-buttons">
                        <Link to={`/tickets/${eventName}/${selectedDate}`}>
                            <button className="buy-tickets-button">Buy Tickets!</button>
                        </Link>

                        <button
                            className="save-event-button"
                            onClick={() => setIsSaved(!isSaved)}
                            onMouseEnter={() => setButtonText(isSaved ? 'Unsave' : 'Save Event')}
                            onMouseLeave={() => setButtonText(isSaved ? 'Saved' : 'Save Event')}
                        >
                            <FaBookmark className={`save-icon ${isSaved ? 'saved' : 'unsaved'}`} />
                            {buttonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventPage;
