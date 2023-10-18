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

app.post('/signin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    connection.query(
      "SELECT * FROM user WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) {
          console.error('Database error: ' + err.message);
          res.status(500).send({ error: 'Database error' });
        } else {
          if (result.length > 0) {
            console.log('Login successful');
            res.status(200).send({ status: 200, result: result });
          } else {
            console.log('Login failed');
            res.status(401).send({ message: 'Login failed' });
          }
        }
      }
    );
  });
  app.post('/signup', (req, res) => {
    const userData = req.body.user;
    const addressData = req.body.address;
    
    // Insert user data into the "user" table
    connection.query('INSERT INTO user SET ?', userData, (userInsertError, userResult) => {
      if (userInsertError) {
        console.error('User insert error:', userInsertError);
        res.status(500).send('User registration failed');
        return;
      }
  
      // Retrieve the last inserted user ID
      connection.query('SELECT LAST_INSERT_ID() as user_id', (idQueryError, idResult) => {
        if (idQueryError) {
          console.error('User ID retrieval error:', idQueryError);
          res.status(500).send('User registration failed');
          return;
        }
  
        // Link the user_id and insert address data into the "user address" table
        addressData.user_id = idResult[0].user_id;
        connection.query('INSERT INTO user_address SET ?', addressData, (addressInsertError) => {
          if (addressInsertError) {
            console.error('Address insert error:', addressInsertError);
            res.status(500).send('User registration failed');
          } else {
            res.status(200).send('User registration successful');
          }
        });
      });
    });
  });  
  
  app.get('/profile/:id', function(req, res) {
    const user_id = req.params.id;
    // console.log('username:', username);
    connection.query('SELECT User_id, Email,Firstname,Lastname,Telephone FROM user WHERE User_id = ?', [user_id],
      function(error, results, fields){
        if (error) {
          console.error('Error querying table:', error);
          res.status(500).send({ error: 'Error querying table' });
        } else {
            res.send(results);
        }
      }
    );
  });

  app.get('/user/orders/:id', function(req, res) {
    const userId = parseInt(req.params.id); // Parse the ID parameter from the URL
    const sqlQuery = `
        SELECT 
            product.product_image, 
            product.User_id, 
            product.Description, 
            product.Created_at, 
            orders.*, 
            payment.Amount
        FROM product 
        INNER JOIN orders ON product.product_id = orders.product_id  
        LEFT JOIN payment ON orders.payment_id = payment.payment_id
        WHERE product.User_id = ?`;

    connection.query(sqlQuery, [userId], function(error, results) {
        if (error) {
            console.error('Error querying table:', error);
            res.status(500).send({ error: 'Error querying table' });
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