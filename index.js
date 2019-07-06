const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { mongoURI } = require('./config/keys');
const port = process.env.PORT || 4000;
/******************************************************************************/
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(mongoURI, { useNewUrlParser: true, useCreateIndex: true });
// models
require('./models/User');
require('./models/Location');
/******************** Passport and Local Strategy Setup ************************/
require('./services/passport');
app.use(passport.initialize());
app.use(passport.session());
/******************************************************************************/
// routes
app.use(require('./routes/index'));

app.listen(port, () => console.log(`Server running on port ${port}`));