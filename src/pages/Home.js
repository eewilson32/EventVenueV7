import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import EventFilter from '../components/EventFilter';
import '../styles.css';

function Home() {
    const [allEvents, setAllEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [maxPrice, setMaxPrice] = useState(0);
    const [filterApplied, setFilterApplied] = useState(false);

    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/events-mock-data.json`)
            .then(response => response.json())
            .then(data => {
                setAllEvents(data.events);
                setFilteredEvents(data.events);
                calculateMaxPrice(data.events, 1);
            });
    }, []);

    const calculateMaxPrice = (events, ticketMultiplier) => {
        let highestPrice = 0;
        events.forEach(event => {
            event.eventDetails.forEach(detail => {
                Object.values(detail.ticketPrices).forEach(price => {
                    highestPrice = Math.max(highestPrice, price * ticketMultiplier);
                });
            });
        });
        setMaxPrice(highestPrice > 0 ? highestPrice : maxPrice);
    };

    const handleFilterChange = (filters) => {
        setFilterApplied(true);
        const selectedGenres = filters.selectedGenres || [];
        const selectedSeatTypes = filters.selectedSeatTypes || [];
        const ticketMultiplier = filters.ticketMultiplier || 1;

        const filtered = allEvents.filter((event) => {
            const matchesSearch = event.eventName.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = filters.category ? event.category.toLowerCase() === filters.category.toLowerCase() : true;
            const matchesMinDate = filters.minDate ? new Date(event.eventDetails[0].date) >= new Date(filters.minDate) : true;
            const matchesMaxDate = filters.maxDate ? new Date(event.eventDetails[0].date) <= new Date(filters.maxDate) : true;
            const matchesMinTime = filters.minTime ? event.eventDetails[0].time >= filters.minTime : true;
            const matchesMaxTime = filters.maxTime ? event.eventDetails[0].time <= filters.maxTime : true;
            const matchesPriceRange = event.eventDetails.some((detail) =>
                selectedSeatTypes.some((seatType) => {
                    const seatPrice = detail.ticketPrices[seatType] * ticketMultiplier;
                    return (filters.minPrice ? seatPrice >= filters.minPrice : true) &&
                        (filters.maxPrice ? seatPrice <= filters.maxPrice : true);
                })
            );
            const matchesGenres = selectedGenres.length > 0 ? selectedGenres.every(genre => event.labels.includes(genre)) : true;
            const matchesSeatTypes = selectedSeatTypes.length > 0 ? selectedSeatTypes.some(seat => event.eventDetails[0].ticketPrices[seat] !== undefined) : true;

            return matchesSearch && matchesCategory && matchesMinDate && matchesMaxDate && matchesMinTime &&
                matchesMaxTime && matchesPriceRange && matchesGenres && matchesSeatTypes;
        });

        const adjustedFilteredEvents = filtered.map(event => ({
            ...event,
            eventDetails: event.eventDetails.map(detail => ({
                ...detail,
                ticketPrices: Object.fromEntries(
                    Object.entries(detail.ticketPrices).map(([key, value]) => [key, value * ticketMultiplier])
                )
            }))
        }));

        setFilteredEvents(adjustedFilteredEvents);
        calculateMaxPrice(adjustedFilteredEvents, filters.ticketMultiplier || 1);
    };

    const handleClearFilter = () => {
        setFilterApplied(false);
        setFilteredEvents(allEvents); // Reset to show all events in the Netflix layout
    };

    const renderEventSections = () => {
        const groupedEvents = {};
        const eventsToDisplay = filterApplied ? filteredEvents : allEvents;

        eventsToDisplay.forEach((event) => {
            event.labels.forEach((label) => {
                if (!groupedEvents[label]) {
                    groupedEvents[label] = [];
                }
                groupedEvents[label].push(event);
            });
        });

        return Object.keys(groupedEvents).map((label, index) => (
            <div key={index} className="horizontal-events-section">
                <h2 className="genre-title">{label}</h2>
                <div className="horizontal-scroll">
                    {groupedEvents[label].map((event, idx) => (
                        <EventCard key={idx} event={event} />
                    ))}
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="background-image"></div>
            <div className="main-section">
                <h1>Welcome to the Event Venue</h1>
                <button onClick={() => window.scrollTo(0, 500)}>Get Your Tickets Now!</button>
            </div>
            <EventFilter onFilterChange={handleFilterChange} maxEventPrice={maxPrice} onClearFilter={handleClearFilter} />
            {filterApplied ? (
                <div className="events-section">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <EventCard key={index} event={event} />
                        ))
                    ) : (
                        <p>There are no events matching your filter.</p>
                    )}
                </div>
            ) : (
                renderEventSections() // Show the Netflix-style layout when no filters are applied
            )}
        </div>
    );
}

export default Home;
