const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { name, mobile, message, projectName } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #b8860b; border-bottom: 2px solid #b8860b; padding-bottom: 10px;">
        New Enquiry Received
      </h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #333; width: 140px;">Name:</td>
          <td style="padding: 10px; color: #555;">${name}</td>
        </tr>
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #333;">Mobile:</td>
          <td style="padding: 10px; color: #555;">${mobile}</td>
        </tr>
        ${projectName ? `
        <tr>
          <td style="padding: 10px; font-weight: bold; color: #333;">Project:</td>
          <td style="padding: 10px; color: #555;">${projectName}</td>
        </tr>` : ""}
        ${message ? `
        <tr style="background: #f9f9f9;">
          <td style="padding: 10px; font-weight: bold; color: #333;">Message:</td>
          <td style="padding: 10px; color: #555;">${message}</td>
        </tr>` : ""}
      </table>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        This enquiry was submitted via the Chase2Success website.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Enquiry from ${name}${projectName ? ` — ${projectName}` : ""}`,
      html: htmlBody,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Email send error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
