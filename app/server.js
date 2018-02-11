let app         = require("express")();
let bodyParser  = require('body-parser');

let router      = require('./router');

let apiPrefix = '/api/v1';
let port = 3000;

// Express server middleware
app.use(bodyParser.json());
// Mapping route to router
app.use(apiPrefix, router);

app.listen(port, () => console.log(`Server is listening on port ${port}`));