const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const rateLimitMiddleware = require('./middleware/rateLimitMiddleware');
const Note = require("./models/Note");
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');
const getRandomUser = require('./routes/getRandomUserRoute');
const config = require('./config')


try {
    mongoose.connect(config.mongo_uri).then(() => {
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
app.use('/api/getRandomUser', rateLimitMiddleware, getRandomUser);

module.exports = app;

if (process.env.NODE_ENV !== 'test' && !module.parent) {
   
    const server = app.listen(config.port, () => {
        //console.log(`Listening on port ${PORT}`);
    });

    module.exports = { app, server };
}

