// CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (eventName, eventDate, ticketsToAdd, eventDescription) => {
        const decodedEventName = decodeURIComponent(eventName);
        console.log("Adding to cart:", { decodedEventName, eventDate, ticketsToAdd, eventDescription });
        
        setCartItems(prevCart => {
            const updatedCart = [...prevCart];
            const existingEventIndex = updatedCart.findIndex(item => item.eventName === decodedEventName && item.eventDate === eventDate);
    
            if (existingEventIndex > -1) {
                const existingEvent = updatedCart[existingEventIndex];
                ticketsToAdd.forEach(ticket => {
                    const ticketIndex = existingEvent.tickets.findIndex(t => t.type === ticket.type);
                    if (ticketIndex > -1) {
                        // Update quantity for existing ticket type
                        existingEvent.tickets[ticketIndex].quantity = ticket.quantity;
                    } else {
                        // Add new ticket type
                        existingEvent.tickets.push(ticket);
                    }
                });
            } else {
                // Add new event to cart
                updatedCart.push({
                    eventName: decodedEventName,
                    eventDate,
                    tickets: ticketsToAdd,
                    description: eventDescription,
                });

            }
            console.log("Updated cart:", updatedCart);
            return updatedCart;
        });
    };

    const getTicketQuantities = (eventName, eventDate) => {
        const eventCart = cartItems.find(item => item.eventName === decodeURIComponent(eventName) && item.eventDate === eventDate);
        
        // Default values for ticket types
        const defaultQuantities = {
            box: 0,
            orchestra: 0,
            mainFloor: 0,
            balcony: 0,
        };

        // Return existing quantities or default values
        if (eventCart) {
            return eventCart.tickets.reduce((acc, ticket) => {
                acc[ticket.type] = ticket.quantity;
                return acc;
            }, defaultQuantities);
        }
        return defaultQuantities; // Return default quantities if eventCart is not found
    };
       

    const resetCart = () => setCartItems([]); // Function to reset cart

    const getTotalEventCount = () => {
        return cartItems; 
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, resetCart, getTicketQuantities, getTotalEventCount }}>
            {children}
        </CartContext.Provider>
    );
};
