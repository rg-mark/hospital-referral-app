const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require("cors");
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7046f038897a38",
      pass: "737772c0d587cb"
    }
  });

const app = express();
const port = 4000;
const secretKey = 'your_secret_key';    

const {
    getDoctorReferralsByEmail,
    getPatients,
    patientGetReferralsByEmail
} = require("./Functions")

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'babayaga254',
    database: 'hrms'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Helper functions
const generateToken = (entity) => {
    return jwt.sign({ id: entity.id, email: entity.email, role: entity.role }, secretKey, { expiresIn: '1h' });
};

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, entity) => {
        if (err) return res.sendStatus(403);
        req.entity = entity;
        next();
    });
};

// Routes
app.get('/', (req, res) => res.send('Hello World!'));
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(400).send('User not found');

        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) return res.status(400).send('Invalid password');

        const token = generateToken(user);
        res.json({ token, user });
    });
});

app.post('/register', (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    connection.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('User registered');
    });
});

app.get('/doctor/patients', async (req, res) => {
    try {
        connection.query('SELECT * FROM users WHERE role = "patient"', (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/doctor/referrals', (req, res) => {
    const { email } = req.body;
    connection.query('SELECT * FROM referrals WHERE doctoremail = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/patient/referrals', (req, res) => {
    const { email } = req.body;
    connection.query('SELECT * FROM referrals WHERE patientemail = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Fetch monthly referral data
app.get('/doctor/referral-stats', (req, res) => {
    const query = `
        SELECT 
            MONTH(createdAt) AS month, 
            COUNT(*) AS count 
        FROM referrals 
        WHERE doctoremail = ?
        GROUP BY MONTH(createdAt)
    `;

    const doctoremail = req.query.doctoremail;

    connection.query(query, [doctoremail], (err, results) => {
        if (err) {
            console.error('Error fetching referral stats:', err.message);
            return res.status(500).json({ error: 'Failed to fetch referral stats' });
        }

        res.json(results);
    });
});

// Fetch referral counts for the doctor
app.post('/doctor/referral-counts', (req, res) => {
    const { doctoremail } = req.body;

    const totalReferralsQuery = 'SELECT COUNT(*) AS totalReferrals FROM referrals WHERE doctoremail = ?';
    const pendingReferralsQuery = 'SELECT COUNT(*) AS pendingReferrals FROM referrals WHERE doctoremail = ? AND acknowledged = 0';
    const acknowledgedReferralsQuery = 'SELECT COUNT(*) AS acknowledgedReferrals FROM referrals WHERE doctoremail = ? AND acknowledged = 1';

    connection.query(totalReferralsQuery, [doctoremail], (err, totalResults) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        connection.query(pendingReferralsQuery, [doctoremail], (err, pendingResults) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            connection.query(acknowledgedReferralsQuery, [doctoremail], (err, acknowledgedResults) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    totalReferrals: totalResults[0].totalReferrals,
                    pendingReferrals: pendingResults[0].pendingReferrals,
                    acknowledgedReferrals: acknowledgedResults[0].acknowledgedReferrals,
                });
            });
        });
    });
});


// Acknowledge referral and send email to patient
app.post('/doctor/acknowledge-referral', (req, res) => {
    const { id, patientemail } = req.body;
    console.log(req.body);

    connection.query('UPDATE referrals SET acknowledged = 1 WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
    });
});

// Generate a PDF report (implement using a library like pdfkit or jsPDF)
app.post('/admin/report', (req, res) => {
    // Here, implement your logic to generate a PDF report
    res.json({ message: 'PDF report generated' });
});

// Create patient profile
app.post('/patient/create-profile', (req, res) => {
    const { email, name, address, dob } = req.body;

    connection.query('INSERT INTO patient_profile (email, Name, Address, Dob) VALUES (?, ?, ?, ?)', 
    [email, name, address, dob], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Patient profile created successfully', patientId: results.insertId });
    });
});

// Update patient profile
app.post('/patient/update-profile', (req, res) => {
    const { uid, email, name, address, dob } = req.body;

    connection.query('UPDATE patient_profile SET email = ?, Name = ?, Address = ?, Dob = ? WHERE UID = ?', 
    [email, name, address, dob, uid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.json({ message: 'Patient profile updated successfully' });
    });
});

// Create doctor profile
app.post('/doctor/create-profile', (req, res) => {
    console.log(req.body);
    const { email, name, specialty, photo } = req.body;
    connection.query('INSERT INTO doctor_profile (email, name, specialty, photo) VALUES (?, ?, ?, ?)', 
    [email, name, specialty, photo], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Doctor profile created successfully', doctorId: results.insertId });
    });
});

// Update doctor profile
app.post('/doctor/update-profile', (req, res) => {
    const { uid, email, name, specialty, photo } = req.body;

    connection.query('UPDATE doctor_profile SET email = ?, name = ?, specialty = ?, photo = ? WHERE UID = ?', 
    [email, name, specialty, photo, uid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor profile updated successfully' });
    });
});


app.post('/doctor/create-referral', (req, res) => {
    const { patientemail, referralDetails, createdBy, doctoremail } = req.body;

    // Validate input data
    if (!patientemail || !referralDetails || !createdBy || !doctoremail) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO referrals (patientemail, referralDetails, createdBy, doctoremail) VALUES (?, ?, ?, ?)';
    connection.query(query, [patientemail, referralDetails, createdBy, doctoremail], (err, results) => {
        if (err) {
            console.error('Error creating referral:', err.message); // Log error for debugging
            return res.status(500).json({ error: 'Failed to create referral' });
        }

        // Send email to the patient
        const mailOptions = {
            from: 'stoniedev@gmail.com',
            to: patientemail,
            subject: 'New Referral Created',
            text: `Dear Patient,\n\nYou have a new referral:\n\nDetails: ${referralDetails}\nCreated By: ${createdBy}\n\nBest regards,\nYour Healthcare Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error.message);
                return res.status(500).json({ error: 'Referral created, but failed to send email' });
            }

            // Respond with the created referral details
            res.status(201).json({
                message: 'Referral created successfully',
                referral: {
                    id: results.insertId,
                    patientemail,
                    referralDetails,
                    createdBy,
                    doctoremail,
                    createdAt: new Date().toISOString(), // Current date
                    acknowledged: 0 // Default value for new referral
                }
            });
        });
    });
});

// Fetch all users
app.get('/admin/users', (req, res) => {
    connection.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Fetch all doctors
  app.get('/admin/doctors', (req, res) => {
    connection.query('SELECT * FROM doctor_profile', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Fetch all referrals
  app.get('/admin/referrals', (req, res) => {
    connection.query('SELECT * FROM referrals', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
  
  // Approve a doctor
  app.post('/admin/approve-doctor/:id', (req, res) => {
    const doctorId = req.params.id;
    connection.query('UPDATE doctor_profile SET approved = 1 WHERE UID = ?', [doctorId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Doctor approved' });
    });
  });
  
// Fetch referrals by doctor's email
app.post('/doctor/get/referrals', (req, res) => {
    console.log(req.body);
    const { doctoremail } = req.body;
    
    if (!doctoremail) {
        return res.status(400).json({ error: 'Doctor email is required' });
    }

    const query = 'SELECT * FROM referrals WHERE doctoremail = ?';
    connection.query(query, [doctoremail], (err, results) => {
        if (err) {
            console.error('Error fetching referrals:', err.message); // Log error for debugging
            return res.status(500).json({ error: 'Failed to fetch referrals' });
        }
        console.log(results);
        res.json(results);
    });
});

app.post('/doctor/get/my/referrals', (req, res) => {
    console.log(req.body);
    const { doctoremail } = req.body;
    
    if (!doctoremail) {
        return res.status(400).json({ error: 'Doctor email is required' });
    }

    const query = 'SELECT * FROM referrals WHERE createdBy = ?';
    connection.query(query, [doctoremail], (err, results) => {
        if (err) {
            console.error('Error fetching referrals:', err.message); // Log error for debugging
            return res.status(500).json({ error: 'Failed to fetch referrals' });
        }
        console.log(results);
        res.json(results);
    });
});

// Acknowledge referral
app.post('/doctor/acknowledge-referral', (req, res) => {
    const { id, patientemail } = req.body;

    if (!id || !patientemail) {
        return res.status(400).json({ error: 'Referral ID and patient email are required' });
    }

    const query = 'UPDATE referrals SET acknowledged = 1 WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error acknowledging referral:', err.message); // Log error for debugging
            return res.status(500).json({ error: 'Failed to acknowledge referral' });
        }

        // Send email logic (omitted for brevity)
        // e.g., sendEmail(patientemail, 'Referral Acknowledged', 'Your referral has been acknowledged.')

        res.json({ message: 'Referral acknowledged' });
    });
});


// Doctor update profile
app.post('/doctor/update-profile', (req, res) => {
    const { uid, email, name, specialty, photo } = req.body;

    connection.query('UPDATE doctor_profile SET email = ?, name = ?, specialty = ?, photo = ? WHERE UID = ?', 
    [email, name, specialty, photo, uid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

app.post('/patient/profile', (req, res) => {
    const {email} = req.body; // Assuming you send email in query params

    const query = 'SELECT * FROM patient_profile WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.length > 0) {
            res.json(results[0]);   
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    });
});


// Hospital routes
app.post('/hospital/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    connection.query('INSERT INTO hospitals (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('Hospital registered');
    });
});

app.post('/hospital/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM hospitals WHERE email = ?', [email], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.status(400).send('Hospital not found');

        const hospital = results[0];
        const isPasswordValid = bcrypt.compareSync(password, hospital.password);
        if (!isPasswordValid) return res.status(400).send('Invalid password');

        const token = generateToken(hospital);
        res.json({ token });
    });
});

// Referral routes
app.post('/referrals', authenticateToken, (req, res) => {
    const { patientName, referralDetails } = req.body;
    connection.query('INSERT INTO referrals (patientName, referralDetails, createdBy) VALUES (?, ?, ?)', [patientName, referralDetails, req.entity.email], (err, results) => {
        if (err) return res.status(500).send('Server error');
        res.status(201).send('Referral created');
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
