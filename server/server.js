const express = require("express");
const cors = require("cors");
require("dotenv").config();

const sequelize = require("./config/database");

require("./models/User");
require("./models/Resource");
require("./models/Booking");

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");

const app = express();

const http = require("http");

const server = http.createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {

    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }

});

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/availability", availabilityRoutes);

sequelize.sync({ alter: true })
    .then(() => console.log("Database synced"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Smart Campus API Running");
});

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {

    console.log("User Connected");

    socket.on("disconnect", () => {

        console.log("User Disconnected");

    });

});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = io;
