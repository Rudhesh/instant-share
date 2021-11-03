import nodemailer from "nodemailer";

async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: "smtp.googlemail.com", // Gmail Host
    port: 465, // Port
    secure: true, // this is true as port is 465
    auth: {
      user: "twentylightyear@gmail.com", // generated ethereal user
      pass: "9977001544", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `Instant Share <${from}>`,
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);
}

export default sendMail;
