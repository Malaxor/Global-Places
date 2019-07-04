const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { mongoURI } = require('./config/keys');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
// routes
require('./routes/index')(app);
mongoose.connect(mongoURI, { useNewUrlParser: true });


app.listen(port, () => console.log(`Server running on port ${port}`));