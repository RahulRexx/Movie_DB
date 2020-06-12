const nodemailer = require("nodemailer");
const mailGun = require("nodemailer-mailgun-transport");
// const { text } = require("express");

const auth = {
    auth : {
        api_key: process.env.API_KEY,
        domain: process.env.DOMAIN
    }
};

const transporter = nodemailer.createTransport(mailGun(auth));

const sendMail = (email,subject,text,callback) => {
    const mailOption = {
        from: email,
        to: "rahulraj.raj3325@gmail.com",
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOption, (err, data) => {
        if (err) {
            callback(err,null);
        } else {
            // console.log("Messege Sent");
            callback(null,data);
        }
    });
}


module.exports = {
    sendMail 
}