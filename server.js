const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const session = require('express-session');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const mysql = require('mysql2');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true }));



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


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port:465,
    secure: true,
    debug: true,
    secureConnection: false,
    auth: {
        user: 'rugendomark@gmail.com',
        pass: 'ewyfcxpyuwkdexzd'
    },
    tls: {
        rejectUnAuthorized: true
    }
});


app.get('/home', (req, res) => {
    res.render('home'); // This will render views/home.ejs
});
app.get('/register', (req, res) => {
    res.render('register'); // This will render views/signup.ejs
});

app.post('/register', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('role').isIn(['doctor', 'nurse', 'admin', 'receptionist'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', { errors: errors.array() });
    }

    const { fname, lname, phonenumber, role, email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = crypto.randomBytes(20).toString('hex');
    const activationLink = `http://localhost:5000/activate?token=${activationToken}&email=${email}`;

    const sql = 'INSERT INTO users (first_name, last_name, phone_number, role, email, password, activation_token, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [fname, lname, phonenumber, role, email, hashedPassword, activationToken, username], async (err, result) => {
        if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).send('Server error');
        }
    
    //Send Activation email
        await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Account Activation',
        text: `Please activate your account using the following link: ${activationLink}`
    });

    res.send('Registration successful! Please check your email to activate your account.');
});
});

// Activation route
app.get('/activate', (req, res) => {
    const { token, email } = req.query;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Server error');
        }
        const user = results[0];

        if (!user) {
            return res.status(400).send('Invalid activation link.');
          }

     // Activate user account
     const updateSql = 'UPDATE users SET activation_token = 1 WHERE email = ?';
     db.query(updateSql, [email], (updateErr) => {
       if (updateErr) {
         console.error('Error activating user account:', updateErr);
         return res.status(500).send('Server error');
       }
       res.send('Account activated successfully. You can now login.');
     });
});
});



app.get('/login', (req, res) => {
    res.render('login'); // This will render views/login.ejs
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.send('User not found');
          }

        const user = results[0]; 

        const match = await bcrypt.compare(password, user.password);
        if (match) {
          
            req.session.user = user;
            
            // Send login notification email
          transporter.sendMail({
            from: 'rugendomark@gmail.com',
            to: email,
            subject: 'Login Notification',
            text: 'Your account was logged into successfully.'
          });
    
          return res.send('Login successful');
        } else {
          return res.send('Invalid credentials');
        }
      
});
});
// Password reset request route
app.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const resetToken = crypto.randomBytes(20).toString('hex');
    const sql = 'UPDATE users SET reset_token = ? WHERE email = ?';

    db.query(sql, [resetToken, email], (err, result) => {
        if (err) throw err;

        if (result.affectedRows === 0) {
            res.send('Invalid email.');
        } else {
            const resetLink = `http://localhost:5000/reset-password?token=${resetToken}&email=${email}`;

            transporter.sendMail({
                from: 'rugendomark@gmail.com',
                to: email,
                subject: 'Password Reset',
                text: `Please reset your password using the following link: ${resetLink}`
            }, (err, info) => {
                if (err) throw err;
                res.send('Password reset link sent! Please check your email.');
            });
        }
    });
});
    
// Password reset form route
app.get('/reset-password', (req, res) => {
    const { token, email } = req.query;
    res.render('reset-password', { token, email });
});

app.post('/reset-password', async (req, res) => {
    const { token, email, newPassword } = req.body;
    const hashedPassword =  bcrypt.hash(newPassword, 10);
    const sql =  db.query('SELECT email FROM users WHERE reset_token = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)', [token]);
    db.query(sql, [hashedPassword, email, token], async (err, result) => {
       
        if (result.length === 0) {
            return res.status(400).send('Invalid or expired token.');
        }
        
        const email = result[0].email;

       // Update the user's password in the database
   const reset = db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);

   // Invalidate or delete the token from the database
   const remove = db.query('DELETE FROM password_reset_tokens WHERE token = ?', [token]);
     
          res.send('Password reset successful!');
});
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(5000, () => {console.log("Server started on port 5000")})