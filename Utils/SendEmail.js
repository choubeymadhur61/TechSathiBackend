const nodemailer = require('nodemailer');

const sendWelcomeEmail = async (userEmail, userName) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: '"TechSathi Support" <support@techsathi.in>',
        to: userEmail,
        subject: 'Welcome to TechSathi Bhopal! 🛠️',
        text: `Hi ${userName}, thank you for joining TechSathi. Your account is successfully created. We are ready to provide doorstep IT support for you!`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendWelcomeEmail;