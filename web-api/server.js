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
    database: 'phimniyom_db'
});
// set mysql table names
const database = 'designshop'
const tables = ["orders", "payment", "product", "product_detail", "user", "user_address"];
// connect to database 
connection.connect(function (err) {  
    if (err) throw err
    console.log('You are now connected with mysql database...')
})
// define root route

for (var i = 0; i < tables.length; i++) {
    (function(table) {
    app.get('/' + table, function(req, res) {
        connection.query('SELECT * FROM `' + table + '`', function(error, results, fields) {
        if (error) throw error;
        return res.send(results);
        });
    })
    })(tables[i]);
}


app.get('/user/orders', function(req, res) {
    connection.query('SELECT product.product_image, product.User_id, product.Description, product.Created_at, orders.*, payment.Amount ' +
    'FROM product ' +
    'INNER JOIN orders ON product.product_id = orders.product_id ' +
    'LEFT JOIN payment ON orders.payment_id = payment.payment_id', function(error, results) {
        if (error) {
            console.error('Error querying table');
        } else {
            res.send(results);
        }
    });
});

// update customer data from mysql database by id
app.put('/user/:username', function(req, res) {
    const User_id = parseInt(req.params.username);
    const { Firstname, Lastname, Telephone, Address, Zipcode , City, Country} = req.body;
    connection.query('UPDATE user'
    + 'LEFT JOIN user_address ON user.User_id = user_address.User_id'
    + 'SET user.Firstname = ?, user.Lastname = ?, user.Telephone = ?, user_address.Address = ?, user_address.Zipcode = ?, user_address.City = ?, user_address.Country = ?'
    + 'WHERE user.User_id = ?',
    [ Firstname, Lastname, Telephone, Address, Zipcode , City, Country,User_id],
    function(error, results, fields) {
        if (error) {
        res.status(500).send({ message: "Error updating customer data" });
        } else if (results.affectedRows > 0) {
        res.status(200).send({ message: "Customer updated successfully" });
        } else {
        res.status(401).send({ message: "Customer not found" });
        }
    }
    );
});

// listen to port
app.listen(port, function () {
    console.log('Node app is running on port ' + port);
})