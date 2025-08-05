const express = require("express");
const app = express();
const { DBConnection } = require("./database/db");
const authRoutes = require("./routes/auth.route");
const middlewareError = require('./middleware/middlewareError');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true               // if sending cookies/token
}));

require("dotenv").config();
DBConnection();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const errorHandler = (err, req, res, next) => {
//   console.error(err.stack);

//   res.status(err.statusCode || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// };


app.use(middlewareError);