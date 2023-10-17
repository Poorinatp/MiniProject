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
var path = require('path');
var fs = require('fs');

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
const database = 'phimniyom_db'
const tables = ["orders", "payment", "product", "product_detail", "user", "user_address"];
// connect to database 
connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected with mysql database...')
})
// define root route
app.get('/', function (req, res) {
    res.send('Hello World');
});

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

app.get('/all', function(req, res) {
    const allData = {};

    // Loop through the tables and fetch data for each table
    tables.forEach(function(table) {
        connection.query('SELECT * FROM `' + table + '`', function(error, results, fields) {
            if (error) throw error;

            // Store the results in the 'allData' object with the table name as the key
            allData[table] = results;

            // Check if we have fetched data for all tables
            if (Object.keys(allData).length === tables.length) {
                // If all tables have been processed, send the 'allData' object as a response
                res.send(allData);
            }
        });
    });
});

app.get('/products-with-details/:productid', function (req, res) {
    const productid = req.params.productid; // Get the productid parameter from the URL

    connection.query('SELECT * FROM product JOIN product_detail ON product.product_id = product_detail.product_id WHERE product.product_id = ?', [productid], function (error, results, fields) {
        if (error) throw error;
            res.send(results);
    });
});

app.get('/fonts', (req, res) => {
    const fontsDir = path.join(__dirname, './fonts');
    fs.readdir(fontsDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading fonts directory');
            return;
        }
        
        const fontsWithoutExtension = files.map((file) => file.replace('.ttf', ''));

        res.json(fontsWithoutExtension);
    });
});

app.get('/picture', (req, res) => {
    const imagesDir = path.join(__dirname, './picture');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading images directory');
            return;
        }
        const imageFiles = files.filter((file) => {
            const extname = path.extname(file).toLowerCase();
            return extname === '.jpg' || extname === '.png' || extname === '.gif' || extname === '.jpeg';
        });

        res.json(imageFiles);
    });
});

// listen to port
app.listen(port, function () {
    console.log('Node app is running on port ' + port);
})