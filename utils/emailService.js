require("dotenv").config();
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION, // Ensure it's correctly set
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Send Email using AWS SES
 * @param {string} to - Recipient email
 * @param {string} subject - Email Subject
 * @param {string} htmlBody - HTML Content
 */
const sendEmail = async (to, subject, htmlBody) => {
  try {
    if (!process.env.AWS_SES_FROM_EMAIL) {
      throw new Error(
        "❌ AWS_SES_FROM_EMAIL is missing in environment variables."
      );
    }

    const params = {
      Source: process.env.AWS_SES_FROM_EMAIL, // Ensure this is set
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Html: {
            Data: htmlBody,
          },
        },
      },
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);
    console.log(`📧 Email sent successfully to ${to}`);
  } catch (error) {
    console.error("❌ AWS SES Email Error:", error);
  }
};

module.exports = { sendEmail };
