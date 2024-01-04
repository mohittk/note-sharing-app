const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const Note = require("./models/Note");
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const getRandomUser = require('./routes/getRandomUserRoute');
const { getRounds } = require("bcrypt");

dotenv.config();

try {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        //console.log("DB connected");
    });
} catch (err) {
    console.error(err);
}

app.use(express.json());
app.use(rateLimitMiddleware);

app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/getRandomUser', getRandomUser);

module.exports = app;

if (process.env.NODE_ENV !== 'test' && !module.parent) {
   
    const server = app.listen(PORT, () => {
        //console.log(`Listening on port ${PORT}`);
    });

    module.exports = { app, server };
}

