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
var multer = require('multer');
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

const shirtDesignStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../web-app/public/shirt-design');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const receiptStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../web-app/public/receipts-uncheck');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadShirtDesign = multer({ storage: shirtDesignStorage });
const uploadReceipt = multer({ storage: receiptStorage });

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

    connection.query('SELECT * FROM product \
    JOIN product_detail ON product.product_id = product_detail.product_id \
    WHERE product.product_id = ?\
    ', [productid], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.status(200).send(results);
        } else {
          res.status(400).send({ message: 'Product not found!' });
        }
    });
});

app.get('/fonts', (req, res) => {
    const fontsDir = path.join(__dirname, './fonts');
    fs.readdir(fontsDir, (err, files) => {
        if (err) {
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
          res.status(500).send({ error: 'Database error' });
        } else {
          if (result.length > 0) {
            res.status(200).send({ status: 200, result: result });
          } else {
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
        console.log(userInsertError)
        res.status(500).send('User registration failed');
        return;
      }
  
      // Retrieve the last inserted user ID
      connection.query('SELECT LAST_INSERT_ID() as user_id', (idQueryError, idResult) => {
        if (idQueryError) {
          console.log(idQueryError)
          res.status(500).send('User registration failed');
          return;
        }
  
        // Link the user_id and insert address data into the "user address" table
        addressData.user_id = idResult[0].user_id;
        connection.query('INSERT INTO user_address SET ?', addressData, (addressInsertError) => {
          if (addressInsertError) {
            console.log(addressInsertError)
            res.status(500).send('User registration failed');
          } else {
            res.status(200).send('User registration successful');
          }
        });
      });
    });
  });  
  
  app.get('/profile/:id', function (req, res) {
    const user_id = req.params.id;
  
    // Your database connection and configuration code (e.g., 'connection') should be defined before this point.
  
    const sql = `
      SELECT user.User_id, user.Email, user.Firstname, user.Lastname, user.Telephone,
             user_address.Address, user_address.Zipcode, user_address.City, user_address.Country
      FROM user
      JOIN user_address ON user.User_id = user_address.User_id
      WHERE user.User_id = ?;
    `;
    connection.query(sql, [user_id], function (error, results, fields) {
      if (error) {
        console.error('Error querying table:', error);
        res.status(500).send({ error: 'Error querying table' });
      } else {
        res.send(results);
      }
    });
  });
  

  app.get('/user/product/:id', function(req, res) {
    const userId = parseInt(req.params.id);
    const sqlQuery = `SELECT * FROM product WHERE product.User_id = ? AND status = 'enable';`;

    connection.query(sqlQuery, [userId], function(error, results) {
        if (error) {
            res.status(500).send({ error: 'Error querying table' });
        } else {
            res.send(results);
        }
    });
});
app.get('/product/admin', function(req, res) {
  const sqlQuery = `SELECT product.* , user.Firstname FROM product INNER JOIN user ON product.User_id = user.User_id WHERE user.Firstname ='Admin' AND status = 'enable';`;
  connection.query(sqlQuery, function(error, results) {
      if (error) {
          res.status(500).send({ error: 'Error querying table' });
      } else {
          res.send(results);
      }
  });
});

// update customer data from mysql database by id
app.put('/update/:id', function(req, res) {
  const user_id = parseInt(req.params.id);
  const { Firstname, Lastname, Telephone, Address, Zipcode, City, Country } = req.body;
  const sql = `
    UPDATE user
    LEFT JOIN user_address ON user.User_id = user_address.User_id
    SET user.Firstname = ?, user.Lastname = ?, user.Telephone = ?, user_address.Address = ?, user_address.Zipcode = ?, user_address.City = ?, user_address.Country = ?
    WHERE user.User_id = ?
  `;
  connection.query(sql, [Firstname, Lastname, Telephone, Address, Zipcode, City, Country, user_id], function(error, results, fields) {
    if (error) {
      res.status(500).send({ message: "Error updating customer data" + error.message }) ;
    } else if (results.affectedRows > 0) {
      res.status(200).send({ message: "Customer updated successfully" });
    } else {
      res.status(404).send({ message: "Customer not found" });
    }
  });
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


app.delete('/delete/:productId', function (req, res) {
  const product_id = req.params.productId;

  connection.query('DELETE FROM product_detail WHERE Product_id = ?', [product_id], function (error, results) {
    if (error) {
      console.error('Error deleting product_detail:', error);
      res.status(500).send({ error: 'Error deleting product_detail: ' + error.message });
    } else if (results.affectedRows > 0) {
      res.status(200).send({ message: 'Product_detail deleted successfully' });

      // Update the status in the "product" table to "Disable"
      connection.query('UPDATE product SET status = ? WHERE Product_id = ?', ['disable', product_id], function (updateError, updateResults) {
        if (updateError) {
          console.error('Error updating product status:', updateError);
          res.status(500).send({ error: 'Error updating product status: ' + updateError.message });
        } else {
          res.status(200).send(updateResults)
        }
      });
    } else {
      res.status(401).send({ message: 'Product_detail not found' });
    }
  });
});

app.get('/picture', (req, res) => {
    const imagesDir = path.join(__dirname, './picture');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
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

app.post('/saveimage', uploadShirtDesign.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image file');
    }
    res.status(200).send(req.file.path.replace(/^\.\.\/web-app\/public\//, '/'));
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/savereceipt', uploadReceipt.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No image file');
    }
    res.status(200).send(req.file.path.replace(/^\.\.\/web-app\/public\//, '/'));
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/saveproduct', async (req, res) => {
  try {
    const productData = req.body.productData;
    const productDetails = req.body.productDetails;

    // Insert into the product table
    const productQuery = 'INSERT INTO product (User_id, Description, product_image, status) VALUES (?, ?, ?, ?)';
    const productValues = [
      productData.User_id,
      productData.Description,
      productData.product_image,
      productData.status
    ];

    connection.query(productQuery, productValues, (productError, productResults) => {
      if (productError) {
        console.log(productError);
        res.status(500).json({ message: 'Error inserting product data' + productError.message });
      } else {
        const productId = productResults.insertId;

        const insertProductDetail = (index) => {
          if (index < productDetails.length) {
            const productDetailData = productDetails[index];
            productDetailData.Product_id = productId;
            const insertProductDetailQuery = 'INSERT INTO product_detail (Product_id, Font_size, Font_family, Font_color, location_img, img_width, img, location_text, text_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const productDetailValues = [
              productDetailData.Product_id,
              productDetailData.Font_size,
              productDetailData.Font_family,
              productDetailData.Font_color,
              productDetailData.location_img,
              productDetailData.img_width,
              productDetailData.img,
              productDetailData.location_text,
              productDetailData.text_value,
            ];

            connection.query(insertProductDetailQuery, productDetailValues, (productDetailError) => {
              if (productDetailError) {
                console.log(productDetailError);
                res.status(500).json({ message: `Error inserting product detail at index ${index}` + productDetailError.message });
              } else {
                insertProductDetail(index + 1); // Insert the next product detail
              }
            });
          } else {
            // All product details inserted, send a success response
            res.status(200).json({ message: 'Product and details saved successfully', insertId: productId });
          }
        };

        insertProductDetail(0); // Start inserting product details
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/createpayment', async (req, res) => {
  try {
    const paymentData = req.body.paymentData;

    // Insert into the product table
    const paymentQuery = 'INSERT INTO payment (User_id, Amount, status) VALUES (?, ?, ?)';
    const paymentValues = [
      paymentData.User_id,
      paymentData.Amount,
      paymentData.status,
    ];

    connection.query(paymentQuery, paymentValues, (paymentError, paymentResults) => {
      if (paymentError) {
        console.log(paymentError);
        res.status(500).json({ message: 'Error inserting payment data' + paymentError.message });
      } else {
        const paymentId = paymentResults.insertId;
        res.status(200).json({ message: 'Payment created successfully', insertId: paymentId });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/createorder', async (req, res) => {
  try {
    const orderData = req.body.orderData;

    // Insert into the product table
    const orderQuery = 'INSERT INTO orders (Product_id, Payment_id, Color, Size, Total_item) VALUES (?, ?, ?, ?, ?)';
    const orderValues = [
      orderData.Product_id,
      orderData.Payment_id,
      orderData.Color,
      orderData.Size,
      orderData.Total_item
    ];

    connection.query(orderQuery, orderValues, (orderError, orderResults) => {
      if (orderError) {
        console.log(orderError);
        res.status(500).json({ message: 'Error inserting order data' + orderError.message });
      } else {
        const orderId = orderResults.insertId;
        res.status(200).json({ message: 'Order created successfully', orderId: orderId });
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/user/order/admin', function(req, res) {
  const status = req.body.status;
  const sqlQuery = `SELECT user.User_id, orders.Order_id, payment.Amount, payment.status FROM user 
  INNER JOIN payment ON user.User_id = payment.User_id 
  INNER JOIN orders ON orders.Payment_id = payment.Payment_id
  WHERE payment.status = ?;
  `;

  connection.query(sqlQuery, [ status ], function(error, results) {
      if (error) {
          res.status(500).send({ error: 'Error querying table' });
      } else {
          res.send(results);
      }
  });
});

app.post('/allorders', function (req, res) {
  const { firstNumber, secondNumber } = req.body.numberItem
  connection.query('SELECT Order_id, Total_Item FROM orders WHERE Total_Item BETWEEN ? AND ?', [firstNumber, secondNumber], function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
          res.status(200).send(results);
      } else {
          res.status(400).send({ message: 'No matching orders found!' });
      }
  });
});

app.get('/allorderssize', function (req, res) {
  connection.query('SELECT Size, SUM(Total_Item) AS COUNT_Size FROM orders group by Size', function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
          res.status(200).send(results);
      } else {
          res.status(400).send({ message: 'No matching orders found!' });
      }
  });
});
// listen to port
app.listen(port, function () {
    console.log('Node app is running on port ' + port);
})