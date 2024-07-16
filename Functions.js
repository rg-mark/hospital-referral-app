const {connection} = require("./Config/db");

function getPatients(){
    return connection.query("SELECT username, email FROM users WHERE role = 'patient' ", (err, results)=>{
        if(err){
            console.error(err);
        }else{
           return results;
        }
    });
}

function getDoctorReferralsByEmail(email) {
    let complete = [];
    connection.query(`SELECT * FROM referrals where doctoremail = '${email}'`, (err, results)=>{
        if(err){
            console.error(err);
        }else{
            console.log(results);
            return results;
        }
    });
}

function patientGetReferralsByEmail(email){
    connection.query(`SELECT * FROM referrals where patientemail = '${email}'`, (err, results)=>{
        if(err){
            console.error(err);
        }else{
            console.log(results);
            return results;
        }
    });    
}

module.exports = {getPatients, getDoctorReferralsByEmail, patientGetReferralsByEmail}