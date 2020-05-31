const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const PORT = 5000;

const { mongoURI } = require("./keys");



mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
    console.log("connected")
})

mongoose.connection.on('error', (err) => {
    console.log("Error:", err)
})
app.use(cors())
require("./models/User");
require("./models/Post");

app.use(express.json())

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/post"));


app.listen(PORT, () => {
    console.log("Server Started on", PORT)
})