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

app.use(cors());

// Configure body parser to handle post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set server port
const port = 8090;

// Create a PostgreSQL connection pool
/* const pool = new Pool({
  user: 'phimniyom_db_user',
  host: 'dpg-ckfvv5oeksbs73ddisrg-a.singapore-postgres.render.com',
  database: 'phimniyom_db',
  password: 'E6AZT9MBO7S1Gd3Z1QGNdOo9Wtlte9Zh',
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // You can set this to true if your server has a valid SSL certificate
  },
}); */
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

// Listen to port
app.listen(port, () => {
  console.log(`Node app is running on port ${port}`);
});