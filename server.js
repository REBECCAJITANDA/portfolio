const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// Replace with your MySQL connection details
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password',
  database: 'myDB'
});

// Connect to MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Parse form data (URL encoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle contact form submission
app.post('/submit-contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;

  const sql = `INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`;

  connection.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Error inserting data into database:', err);
      res.status(500).send('Error submitting form');
    } else {
      console.log('Contact information saved successfully:', result);
      res.send('Form submitted successfully!');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
