// use nodemailer to send email, gmail as the email service provider and gmail app password generator to generate the password so that we don't have to use our real password.

const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {

            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    });


    const info = await transporter.sendMail({
        from: '"🤖 J.A.R.V.I.S. 🤖" <jarvis_reset@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);
}
);



module.exports = sendEmail;