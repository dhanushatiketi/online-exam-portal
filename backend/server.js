const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/examDB")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const authRoutes = require("./routes/authRoutes");
const examRoutes = require("./routes/examRoutes");
const resultRoutes = require("./routes/resultRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", examRoutes);
app.use("/api", resultRoutes);

app.get("/", (req, res) => {
    res.send("Online Examination System Backend Running");
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});