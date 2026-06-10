import { useEffect, useState } from "react";

import API from "../services/api";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import "./CalendarPage.css";

import Navbar from "../components/Navbar";

function CalendarPage({ darkMode, setDarkMode }) {

    const [date, setDate] = useState(new Date());

    const [bookings, setBookings] = useState([]);

    // FETCH BOOKINGS
    const fetchBookings = async () => {

        try {

            const res = await API.get(
                "/bookings"
            );

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchBookings();

    }, []);

    // FORMAT DATE
    const selectedDate = date.toLocaleDateString("en-CA");

    // FILTER BOOKINGS
    const filteredBookings = bookings.filter(

        (booking) => booking.date === selectedDate

    );

    return (

         <div className="calendar-wrapper">

             <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

         <div className="calendar-container">

                <h1 className="calendar-title">

                    Booking Calendar

                </h1>

                <Calendar
                    onChange={setDate}
                    value={date}
                />

                <h2 className="booking-heading">

                    Bookings for {selectedDate}

                </h2>

                {

                    filteredBookings.length === 0 ? (

                        <p>No bookings</p>

                    ) : (

                        filteredBookings.map((booking) => (

                            <div
                                key={booking.id}
                                className="booking-card"
                            >

                                <p>

                                    <strong>Resource ID:</strong>
                                    {" "}
                                    {booking.resourceId}

                                </p>

                                <p>

                                    <strong>Time:</strong>
                                    {" "}
                                    {booking.startTime}
                                    {" "}
                                    -
                                    {" "}
                                    {booking.endTime}

                                </p>

                                <p>

                                    <strong>Status:</strong>
                                    {" "}
                                    {booking.status}

                                </p>

                            </div>

                        ))

                    )

                }

            </div>

        </div>

    );

}

export default CalendarPage;