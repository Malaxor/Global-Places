const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { mongoURI } = require('./config/keys');
const port = process.env.PORT || 4000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
// models
require('./models/User');
require('./models/Location');
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
// passport
require('./services/passport');
// routes
app.use(require('./routes/index'));

app.listen(port, () => console.log(`Server running on port ${port}`));