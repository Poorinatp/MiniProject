// *** note for front-end-devs:
// *** to start server type in terminal: pm2 start server.js
// *** to stop server type in terminal: pm2 stop server.js
// *** to restart server type in terminal: pm2 restart server.js
// *** to delete server type in terminal: pm2 delete server.js
// *** to see all servers type in terminal: pm2 list

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Create express app
const app = express();
const cors = require('cors');
var path = require('path');
var fs = require('fs');
var multer = require('multer');

app.use(cors());

// Configure body parser to handle post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set server port
const port = 8090;

// Create a PostgreSQL connection pool
// const pool = new Pool({
//   user: 'phimniyom_db_user',
//   host: 'dpg-ckfvv5oeksbs73ddisrg-a.singapore-postgres.render.com',
//   database: 'phimniyom_db',
//   password: 'E6AZT9MBO7S1Gd3Z1QGNdOo9Wtlte9Zh',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false, // You can set this to true if your server has a valid SSL certificate
//   },
// });
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false, // You can set this to true if your server has a valid SSL certificate
  },
});

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
    cb(null, '../web-app/public/receipts-uncheck'); // Set the destination folder for receipts
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadShirtDesign = multer({ storage: shirtDesignStorage });
const uploadReceipt = multer({ storage: receiptStorage });


pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err.message);
});

// Set PostgreSQL table names
const tables = ["orders", "payment", "product", "product_detail", "user", "user_address"];

// Define root route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Define routes for fetching data from tables
tables.forEach((table) => {
  app.get(`/${table}`, (req, res) => {
    pool.query(`SELECT * FROM '${table}'`, (error, results) => {
      if (error) throw error;
      res.send(results.rows);
    });
  });
});

// Define route to fetch data from all tables
app.get('/all', (req, res) => {
  const allData = {};

  // Loop through the tables and fetch data for each table
  tables.forEach((table) => {
    pool.query(`SELECT * FROM ${table}`, (error, results) => {
      if (error) throw error;

      // Store the results in the 'allData' object with the table name as the key
      allData[table] = results.rows;

      // Check if we have fetched data for all tables
      if (Object.keys(allData).length === tables.length) {
        // If all tables have been processed, send the 'allData' object as a response
        res.send(allData);
      }
    });
  });
});

app.get('/products-with-details/:productid', async (req, res) => {
  const productid = req.params.productid;

  try {
    const query = {
      text: `
        SELECT * FROM product
        JOIN product_detail ON product.product_id = product_detail.product_id
        WHERE product.product_id = $1
      `,
      values: [productid],
    };

    const result = await pool.query(query);
    
    if (result.rows.length > 0) {
      res.status(200).send(result.rows);
    } else {
      res.status(400).send({ message: 'Product not found!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error querying table' });
  }
});

app.get('/fonts', (req, res) => {
  const fontsDir = path.join(__dirname, './fonts');
  fs.readdir(fontsDir, (err, files) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error reading fonts directory');
          return;
      }
      
      // Remove the .ttf extension from font names
      const fontsWithoutExtension = files.map((file) => file.replace('.ttf', ''));

      res.json(fontsWithoutExtension);
  });
});

app.post('/signin', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const query = {
      text: 'SELECT * FROM "user" WHERE email = $1 AND password = $2',
      values: [email, password],
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.status(200).send({ status: 200, result: result.rows });
    } else {
      res.status(401).send({ message: 'Login failed' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Database error' });
  }
});

app.post('/signup', async (req, res) => {
  const userData = req.body.user;
  const addressData = req.body.address;

  try {
    // Start a transaction to ensure data consistency
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert user data into the "user" table
      const userInsertQuery = {
        text: 'INSERT INTO "user" (email, password) VALUES ($1, $2) RETURNING user_id',
        values: [userData.email, userData.password],
      };
      const userInsertResult = await client.query(userInsertQuery);

      // Retrieve the last inserted user ID
      const user_id = userInsertResult.rows[0].user_id;

      // Link the user_id and insert address data into the "user_address" table
      const addressInsertQuery = {
        text: 'INSERT INTO user_address (user_id, address, city, zipcode, country) VALUES ($1, $2, $3, $4, $5)',
        values: [user_id, addressData.address, addressData.city, addressData.zipcode, addressData.country],
      };
      await client.query(addressInsertQuery);

      await client.query('COMMIT');
      res.status(200).send('User registration successful');
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).send('User registration failed');
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).send('User registration failed');
  }
});

app.get('/profile/:id', async (req, res) => {
  const user_id = req.params.id;

  try {
    const query = {
      text: 'SELECT user_id, email, firstname, lastname, telephone FROM "user" WHERE user_id = $1',
      values: [user_id],
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error querying table' });
  }
});

app.get('/user/orders/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const query = {
      text: `
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
        WHERE product.User_id = $1
      `,
      values: [userId],
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      res.send(result.rows);
    } else {
      res.status(404).send({ message: 'No orders found for this user' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error querying table' });
  }
});

app.put('/user/:username', async (req, res) => {
  const User_id = parseInt(req.params.username);
  const { Firstname, Lastname, Telephone, Address, Zipcode, City, Country } = req.body;

  try {
    const query = {
      text: `
        UPDATE "user"
        SET Firstname = $1, Lastname = $2, Telephone = $3
        FROM user_address
        WHERE "user".user_id = $4
        AND user_address.user_id = $4
      `,
      values: [Firstname, Lastname, Telephone, User_id],
    };

    const result = await pool.query(query);

    if (result.rowCount > 0) {
      res.status(200).send({ message: 'Customer updated successfully' });
    } else {
      res.status(404).send({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Error updating customer data' });
  }
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
  if (!req.file) {
    res.status(400).send('No image file')
  }
  res.status(200).send(req.file.path.replace(/^\.\.\/web-app\/public\//, '/'));
});

app.post('/savereceipt', uploadReceipt.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).send('No image file')
  }
  res.status(200).send(req.file.path.replace(/^\.\.\/web-app\/public\//, '/'));
});

app.post('/saveproduct', async (req, res) => {
  const productData = req.body.productData;
  const productDetails = req.body.productDetails;
  const client = await pool.connect();
  try {
    // Start a transaction to ensure data consistency
    await client.query('BEGIN');

    // Insert product data into the "product" table
    const productQuery = {
      text: 'INSERT INTO product (User_id, Description, product_image) VALUES ($1, $2, $3) RETURNING product_id',
      values: [productData.User_id, productData.Description, productData.product_image],
    };
    const productResult = await client.query(productQuery);
    const productId = productResult.rows[0].product_id;

    // Insert all product details using a loop
    for (let index = 0; index < productDetails.length; index++) {
      const productDetailData = productDetails[index];
      productDetailData.Product_id = productId;

      const productDetailQuery = {
        text: 'INSERT INTO product_detail (Product_id, Font_size, Font_family, Font_color, location_img, img_width, img, location_text, text_value) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        values: [
          productDetailData.Product_id,
          productDetailData.Font_size,
          productDetailData.Font_family,
          productDetailData.Font_color,
          productDetailData.location_img,
          productDetailData.img_width,
          productDetailData.img,
          productDetailData.location_text,
          productDetailData.text_value,
        ],
      };
      await client.query(productDetailQuery);
    }

    await client.query('COMMIT');
    res.status(200).json({ message: 'Product and details saved successfully', insertId: productId });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Error saving product and details' });
  } finally {
    client.release();
  }
});

app.post('/createpayment', async (req, res) => {
  const paymentData = req.body.paymentData;

  try {
    const query = {
      text: 'INSERT INTO payment (user_id, amount, status) VALUES ($1, $2, $3) RETURNING payment_id',
      values: [paymentData.User_id, paymentData.Amount, paymentData.status],
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      const paymentId = result.rows[0].payment_id;
      res.status(200).json({ message: 'Payment created successfully', insertId: paymentId });
    } else {
      res.status(500).json({ message: 'Error creating payment' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment' });
  }
});

app.post('/createorder', async (req, res) => {
  const orderData = req.body.orderData;

  try {
    const query = {
      text: 'INSERT INTO orders (Product_id, Payment_id, Color, Size, Total_item) VALUES ($1, $2, $3, $4, $5) RETURNING order_id',
      values: [
        orderData.Product_id,
        orderData.Payment_id,
        orderData.Color,
        orderData.Size,
        orderData.Total_item
      ],
    };

    const result = await pool.query(query);

    if (result.rows.length > 0) {
      const orderId = result.rows[0].order_id;
      res.status(200).json({ message: 'Order created successfully', orderId: orderId });
    } else {
      res.status(500).json({ message: 'Error creating order' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Listen to port
app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});