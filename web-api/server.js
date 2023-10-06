// *** note for front-end-devs:
// *** to start server type in terminal: pm2 start server.js
// *** to stop server type in terminal: pm2 stop server.js
// *** to restart server type in terminal: pm2 restart server.js
// *** to delete server type in terminal: pm2 delete server.js
// *** to see all servers type in terminal: pm2 list

var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
// create express app
var app = express();
var cors = require('cors')
app.use(cors())
// configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// set server port
var port = 8080;
// create mysql connection
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webappdb'
});
// set mysql table names
const tables = ["login", "customer", "order", "payment", "product_detail", "product_inventory", "product_order"];
// connect to database 
connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
})
// define root route
app.get('/', function (req, res) {
    res.send('Hello World');
});

// listen to port
app.listen(8080, function () {
    console.log('Node app is running on port ' + port);
})