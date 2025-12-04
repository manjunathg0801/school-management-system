import React, { useState, useEffect } from 'react';
import { getEvents, createEvent } from '../services/api';
import { Calendar, Plus, Save, CheckCircle } from 'lucide-react';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Event Form State
    const [newEvent, setNewEvent] = useState({
        name: '',
        date: '',
        type: 'event',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getEvents();
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEvent(newEvent);
            setMessage('Event created successfully!');
            setNewEvent({ name: '', date: '', type: 'event', description: '' });
            fetchData();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error creating event", error);
            setMessage('Failed to create event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Calendar className="mr-3" size={32} />
                    Events & Holidays
                </h1>
                {message && (
                    <div className={`px-4 py-2 rounded flex items-center ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        <CheckCircle size={18} className="mr-2" />
                        {message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            Add New Event
                        </h2>

                        <form onSubmit={handleCreateEvent}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded-md p-2"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    className="w-full border rounded-md p-2"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    className="w-full border rounded-md p-2"
                                    value={newEvent.type}
                                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                                >
                                    <option value="event">Event</option>
                                    <option value="holiday">Holiday</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded-md p-2"
                                    rows="3"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                ></textarea>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold">
                                Create Event
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-bold text-gray-700">
                                Upcoming Events
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                            {loading && events.length === 0 ? (
                                <div className="p-8 text-center">Loading...</div>
                            ) : events.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No events found.</div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="p-4 hover:bg-gray-50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{event.name}</h3>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${event.type === 'holiday' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {event.type.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-900">{event.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
