const mysql = require('mysql2');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'babayaga254',
    database: 'hospital_referral_system'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1); // Exit the process with an error code
    }
    console.log('Connected to MySQL database');
});

db.on('error', (err) => {
    console.error('MySQL error:', err);
});



   

