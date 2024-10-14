const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const result = dotenv.config({ path: path.join(__dirname, '.env') });

if (result.error) {
    console.log("Error loading .env file:", result.error);
} else {
    console.log(".env file loaded successfully");
}

console.log('Current working directory:', process.cwd());
console.log('.env file path:', path.join(__dirname, '.env'));
console.log('Environment variables:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? `Set (length: ${process.env.EMAIL_PASS.length})` : 'Not set');
console.log('EMAIL_RECIPIENT:', process.env.EMAIL_RECIPIENT ? 'Set' : 'Not set');
console.log('PORT:', process.env.PORT ? 'Set' : 'Not set');

const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up Nodemailer transporter
let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    debug: true, // Enable debug logs
    logger: true // Log to console
});

// Verify transporter
transporter.verify(function(error, success) {
    if (error) {
        console.log('Transporter verification error:', error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

// Route for the home page
// Handle form submission
app.post('/submit-form', (req, res) => {
    console.log('Form submission:', req.body);

    // Set up email data
    let mailOptions = {
        from: `"Form Submission" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECIPIENT,
        replyTo: `"${req.body.name}" <${req.body.email}>`,
        subject: `New Form Submission from ${req.body.name}`,
        text: `Name: ${req.body.name}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`,
        html: `<p><strong>Name:</strong> ${req.body.name}</p>
               <p><strong>Email:</strong> ${req.body.email}</p>
               <p><strong>Message:</strong> ${req.body.message}</p>`
    };

 // Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email');
    } else {
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent successfully');
    }
});
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} in your browser`);
});