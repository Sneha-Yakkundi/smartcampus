import { useEffect, useState } from "react";

import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import "./BookingCalendar.css";

import Navbar from "../components/Navbar";

import API from "../services/api";

function BookingCalendar({ darkMode, setDarkMode }) {

    const [date, setDate] = useState(new Date());

    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {

        try {

            const res = await API.get("/bookings");

            setBookings(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    useEffect(() => {

        fetchBookings();

    }, []);

    const formattedDate =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0");

    // FIXED DATE FILTERING
    const selectedDateBookings = bookings.filter((booking) => {

        const bookingDate = new Date(booking.date);

        const formattedBookingDate =
            bookingDate.getFullYear() +
            "-" +
            String(bookingDate.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(bookingDate.getDate()).padStart(2, "0");

        return formattedBookingDate === formattedDate;

    });

    return (

        <div
            style={{
                minHeight: "100vh",
                background: "#0f172a",
                color: "white",
                textAlign: "center",
                padding: "20px"
            }}
        >

            <Navbar />

            <h1
                style={{
                    marginTop: "30px",
                    marginBottom: "30px",
                    fontSize: "50px"
                }}
            >
                Booking Calendar
            </h1>

            <div
                style={{
                    background: "white",
                    width: "350px",
                    padding: "20px",
                    borderRadius: "10px",
                    margin: "auto"
                }}
            >

                <Calendar
                    onChange={setDate}
                    value={date}
                />

            </div>

            <h2
                style={{
                    marginTop: "30px"
                }}
            >

                Bookings for {formattedDate}

            </h2>

            {

                selectedDateBookings.length === 0

                ?

                <p>No bookings</p>

                :

                selectedDateBookings.map((booking) => (

                    <div
                        key={booking.id}
                        style={{
                            border: "1px solid gray",
                            padding: "15px",
                            margin: "15px auto",
                            width: "300px",
                            borderRadius: "10px",
                            background: "#1e293b"
                        }}
                    >

                        <p>

                            Resource ID:
                            {" "}
                            {booking.resourceId}

                        </p>

                        <p>

                            Time:
                            {" "}
                            {booking.startTime}
                            {" - "}
                            {booking.endTime}

                        </p>

                        <p>

                            Status:
                            {" "}
                            {booking.status}

                        </p>

                    </div>

                ))

            }

        </div>

    );

}

export default BookingCalendar;