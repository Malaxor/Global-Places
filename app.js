const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// routes
require('./routes/places')(app);

app.listen(port, () => console.log(`Server running on port ${port}`));