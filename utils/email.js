const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD, //,
        },
    });
    // define email options
    const emailOptions = {
        from: "Sergei Koshelev <koshelevworkmail@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    };
    // send email
    await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
