// EventCard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import { FaBookmark } from 'react-icons/fa'; // Importing the bookmark icon

function EventCard({ event }) {
    const [savedEvents, setSavedEvents] = useState({});

    const formatDateRange = (details) => {
        if (!details || details.length === 0) return '';

        const sortedDates = details
            .map(detail => {
                const dateParts = detail.date.split('-');
                return new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2])); // Ensures UTC date parsing
            })
            .sort((a, b) => a - b);

        const startDate = sortedDates[0];
        const endDate = sortedDates[sortedDates.length - 1];

        const startDay = startDate.getUTCDate();
        const endDay = endDate.getUTCDate();
        const month = startDate.toLocaleString('default', { month: 'short' }).toUpperCase();

        return startDay === endDay ? { day: startDay, month } : { day: `${startDay}-${endDay}`, month };
    };


    const dateRange = formatDateRange(event.eventDetails);

    const truncateDescription = (text, maxLength) => text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;

    const handleSaveClick = (date) => {
        setSavedEvents((prevState) => ({
            ...prevState,
            [date]: !prevState[date],
        }));
    };

    return (
        <div className="row">
            <article className="card fl-left">
                <section className="date">
                    <time>
                        <span className="days">{dateRange.day}</span>
                        <span className="months">{dateRange.month}</span>
                    </time>
                </section>
                <section className="card-cont">
                    <small>{event.category}</small>
                    <h3>{truncateDescription(event.eventName, 30)}</h3>
                    <p>{truncateDescription(event.description, 85)}</p>
                    <div className="even-date">
                        <i className="fa fa-calendar"></i>
                        <time>
                            <span>
                                {`${new Date(Date.UTC(
                                    event.eventDetails[0].date.split('-')[0],
                                    event.eventDetails[0].date.split('-')[1] - 1,
                                    event.eventDetails[0].date.split('-')[2]
                                )).toUTCString().split(' ').slice(0, 4).join(' ')} - ${new Date(Date.UTC(
                                    event.eventDetails[event.eventDetails.length - 1].date.split('-')[0],
                                    event.eventDetails[event.eventDetails.length - 1].date.split('-')[1] - 1,
                                    event.eventDetails[event.eventDetails.length - 1].date.split('-')[2]
                                )).toUTCString().split(' ').slice(0, 4).join(' ')}`}
                            </span>
                            <span>{event.eventDetails[0].time}</span>
                        </time>
                    </div>

                    <div className="event-info">
                        <i className="fa fa-map-marker"></i>
                        <p>{event.location}</p>
                    </div>
                    <div className="button-group">
                        <Link to={`/event/${event.eventName.replace(/\s+/g, '-').toLowerCase()}/${event.eventDetails[0].date}`} className="details-button">Details</Link>
                        <button className="save-button" onClick={() => handleSaveClick(event.eventDetails[0].date)}>
                            <FaBookmark className={`save-icon ${savedEvents[event.eventDetails[0].date] ? 'saved' : 'unsaved'}`} />
                        </button>
                    </div>
                </section>
            </article>
        </div>
    );
}

export default EventCard;
