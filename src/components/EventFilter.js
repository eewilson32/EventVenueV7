import React, { useState, useEffect, useRef } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles.css';

function EventFilter({ onFilterChange, maxEventPrice, onClearFilter }) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [minTime, setMinTime] = useState('');
    const [maxTime, setMaxTime] = useState('');
    const [priceRange, setPriceRange] = useState([0, maxEventPrice]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [ticketMultiplier, setTicketMultiplier] = useState(1);
    const [selectedSeatTypes, setSelectedSeatTypes] = useState(['box', 'orchestra', 'mainFloor', 'balcony']);
    const genres = ["Spectacle (Featured)", "Family Friendly", "Recital", "Drama", "Adventure", "Comedy", "Tragedy", "Romance"];
    const seatTypes = ["box", "orchestra", "mainFloor", "balcony"];
    const filterRef = useRef(null);

    useEffect(() => {
        setPriceRange([0, maxEventPrice]);
    }, [maxEventPrice]);

    const triggerPulseAnimation = () => {
        if (filterRef.current) {
            filterRef.current.classList.add('pulse');
            setTimeout(() => {
                filterRef.current.classList.remove('pulse');
            }, 750);
        }
    };

    const handleFilterChange = (updatedFilters = {}) => {
        triggerPulseAnimation();
        const filters = {
            search,
            category,
            minDate,
            maxDate,
            minTime,
            maxTime,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            selectedGenres,
            ticketMultiplier,
            selectedSeatTypes,
            ...updatedFilters,
        };
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setMinDate('');
        setMaxDate('');
        setMinTime('');
        setMaxTime('');
        setPriceRange([0, maxEventPrice]);
        setSelectedGenres([]);
        setTicketMultiplier(1);
        setSelectedSeatTypes(['box', 'orchestra', 'mainFloor', 'balcony']);

        onFilterChange({
            search: '',
            category: '',
            minDate: '',
            maxDate: '',
            minTime: '',
            maxTime: '',
            minPrice: 0,
            maxPrice: maxEventPrice,
            selectedGenres: [],
            ticketMultiplier: 1,
            selectedSeatTypes: ['box', 'orchestra', 'mainFloor', 'balcony']
        });

        if (typeof onClearFilter === 'function') {
            onClearFilter(); // Notify the parent to switch back to the Netflix layout
        }
    };

    const handleGenreChange = (genre) => {
        setSelectedGenres(prev => {
            const newGenres = prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre];
            handleFilterChange();
            return newGenres;
        });
    };

    const handleSeatTypeChange = (seatType) => {
        setSelectedSeatTypes((prev) =>
            prev.includes(seatType)
                ? prev.filter((s) => s !== seatType)
                : [...prev, seatType]
        );
        handleFilterChange();
    };

    const handlePriceChange = (value) => {
        if (maxEventPrice > 0) {
            setPriceRange(value);
            handleFilterChange({ minPrice: value[0], maxPrice: value[1] });
        }
    };

    const handlePriceInputChange = (index, event) => {
        const newPrice = [...priceRange];
        newPrice[index] = Number(event.target.value);
        setPriceRange(newPrice);
        handleFilterChange({ minPrice: newPrice[0], maxPrice: newPrice[1] });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleFilterChange();
        }
    };

    return (
        <div className="event-filter" ref={filterRef}>
            <h2 className="filter-heading">Filter Events</h2>
            <div className="filter-items">
                <div className="filter-group uniform-width">
                    <label>Find Events By Title</label>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="filter-group uniform-width">
                    <label>Select Genres</label>
                    <div className="filter-group multi-checkbox">
                        {genres.map(genre => (
                            <label key={genre}>
                                <input
                                    type="checkbox"
                                    checked={selectedGenres.includes(genre)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group uniform-width">
                    <label>Select Event Type</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            handleFilterChange({ category: e.target.value });
                        }}
                    >
                        <option value="">All Events</option>
                        <option value="Musical">Musical</option>
                        <option value="Play">Play</option>
                        <option value="Opera">Opera</option>
                        <option value="Ballet">Ballet</option>
                        <option value="Concert">Concert</option>
                    </select>
                </div>

                <div className="filter-group date-range-group uniform-width">
                    <label>Performance Date Range</label>
                    <div className="date-range">
                        <input
                            type="date"
                            value={minDate}
                            onChange={(e) => setMinDate(e.target.value)}
                        />
                        <span className="date-separator">to</span>
                        <input
                            type="date"
                            value={maxDate}
                            onChange={(e) => setMaxDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-group uniform-width">
                    <label>Number of Tickets</label>
                    <input
                        type="number"
                        min="1"
                        value={ticketMultiplier}
                        onChange={(e) => setTicketMultiplier(Number(e.target.value))}
                    />
                </div>

                <div className="filter-group uniform-width">
                    <label>Seat Types</label>
                    <div className="filter-group">
                        {seatTypes.map((type) => (
                            <label key={type}>
                                <input
                                    type="checkbox"
                                    checked={selectedSeatTypes.includes(type)}
                                    onChange={() => handleSeatTypeChange(type)}
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="filter-group uniform-width">
                    <label>Price Range</label>
                    <div className="price-range-inputs">
                        <input
                            type="number"
                            min="0"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceInputChange(0, e)}
                            className="price-input"
                        />
                        <Slider
                            range
                            min={0}
                            max={maxEventPrice || 1}
                            value={priceRange}
                            onChange={handlePriceChange}
                            trackStyle={[{ backgroundColor: 'black', height: 10 }]}
                            handleStyle={[
                                { borderColor: 'black', height: 20, width: 20, marginTop: -5 },
                                { borderColor: 'black', height: 20, width: 20, marginTop: -5 },
                            ]}
                            railStyle={{ backgroundColor: 'gray', height: 10 }}
                        />
                        <input
                            type="number"
                            min="0"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceInputChange(1, e)}
                            className="price-input"
                        />
                    </div>
                    <div className="filter-buttons">
                        <button onClick={() => handleClearFilters()}>Clear</button>
                        <button onClick={() => handleFilterChange()}>Search</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventFilter;
