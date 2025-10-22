const express = require("express");
const app = express();
const { DBConnection } = require("./database/db");
const authRoutes = require("./routes/auth.route");
const problemRoutes = require('./routes/problem.route');
const middlewareError = require('./middleware/middlewareError');
const submissionRoutes = require("./routes/submission.route");
const runRoutes = require("./routes/run.route");
const aiRoutes = require("./routes/ai.routes");
const profileRoutes = require("./routes/profile.route");
const path = require("path");
const cors = require('cors');
const FRONTEND_URI=process.env.FRONTEND_URI

require("dotenv").config();
DBConnection();

app.use("/assets/avatar", express.static(path.join("assets", "avatars")));

app.use(cors({
  origin: `${FRONTEND_URI}`, 
  credentials: true               // if sending cookies/token
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.use('/api/problems', problemRoutes);

app.use('/api', profileRoutes);

app.use("/api", runRoutes);

app.use("/api", submissionRoutes);


app.use("/api/ai", aiRoutes);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.use(middlewareError);
