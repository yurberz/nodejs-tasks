const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.HOST_SENDER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.MAIL_PASS,
  },
});

const url = process.env.SERVER_URL || "https://localhost:3000";

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: url,
  },
});

const sendMail = async (verifyToken, email) => {
  const template = {
    body: {
      name: email,
      intro: "Welcome to Mailgen! We're very excited to have you on board!",
      action: {
        instructions: "To get started with Mailgen, please click here:",
        button: {
          color: "#22BC66",
          text: "Confirm your email",
          link: `${url}/api/users/verify/${verifyToken}`,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };

  const verificationEmail = mailGenerator.generate(template);

  const msg = {
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Email verification",
    html: verificationEmail,
  };

  await transporter.sendMail(msg);
};

module.exports = sendMail;
