# HRMS: A Hospital Referral Management System

## Description

The Hospital Referral Management System (HRMS) is a comprehensive solution designed to streamline the process of patient referrals between healthcare providers. This system aims to improve communication, reduce administrative workload, and enhance patient care by ensuring timely and accurate referrals.

## Features

- **User Management:** Secure login for doctors, nurses, and administrative staff.
- **Patient Records:** Maintain detailed patient profiles with medical history, current condition, and referral status.
- **Referral Creation:** Generate and manage patient referrals to specialists or other healthcare facilities.
- **Status Tracking:** Track the status of referrals in real-time, from submission to completion.
- **Notifications:** Automated email and  notifications for referral status updates.
- **Reporting:** Generate reports on referral activities and outcomes for administrative review.


## Technology Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, bootstrap
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Notifications:**  Nodemailer (for email)


## Installation

### Dependencies

- Node.js 
- MySQL2 
- Express.js
- Bcrypt
- Body-Parser
- Crypto
- Dotenv
- EJS
- Express-MySQL-Session
- Express-Validator
- Fs
- Multer
- Nodemailer
  
 
### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/hospital-referral-management-system.git
   cd hospital-referral-management-system

2. **Install Dependencies:**
    ```bash 
        npm install

3. **Usage Instructions** 

**Configure environement variables:**
- MYSQL_URI=your_mysqldb_uri
- EMAIL_SERVICE=your_email_service
- EMAIL_USER=your_email_user
- EMAIL_PASS=your_email_password

**Run the application:**
    ```bash 
    npm run dev

**Access the application in your browser at `http://localhost:5000`.**


## Input/Output
**Input**
 **Patient Records:**
- Name: String
- Date of Birth: Date
- Medical History: Text
- Current Condition: Text


 **Referral Details:**
- Patient ID: String
- Referral Reason: Text
- Referred To: String (Specialist or Healthcare Facility)
- Referral Date: Date

**Output**
 **Referral Confirmation:**
- Referral ID: String
- Status: String (e.g., "Pending", "Completed")
- Notifications: Email


 **Status Updates:**
- Referral ID: String
- Current Status: String (e.g., "In Progress", "Completed")
- Last Updated: Date/Time


4. **Project Structure**
    ```bash
    project-directory
    │   .gitignore
    │   README.md
    │   server.js                       # Contains the routing APIs
    │
    ├───controllers                     # Responsible for handling incoming requests and returning responses to the client
    │       ...
    │
    ├───models                          # Connection to MySQL Database
    │       database.js
    │       ...
    │
    ├───public                          # Contains the styling for the frontend
    │       ...
    │
    └───views                           # Stores the frontend views
        ...


### License:
This project is licensed under the ISC License. 
