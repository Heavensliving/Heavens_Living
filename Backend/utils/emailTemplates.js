const passwordResetTemplate = (resetLink) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          color: #333333;
        }
        .email-body {
          font-size: 16px;
          color: #555555;
          line-height: 1.6;
        }
        .reset-link {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #007BFF;
          text-decoration: none;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">Password Reset Request</div>
        <div class="email-body">
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the link below to set a new password:</p>
          <a class="reset-link" href="${resetLink}">Reset Password</a>
          <p>Thank you,<br>Heavens</p>
        </div>
        <p style="color: #777; font-size: 12px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email</p>
      </div>
    </body>
  </html>
`;

const emailVerificationTemplate = (link,userId) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          color: #333333;
        }
        .email-body {
          font-size: 16px;
          color: #555555;
          line-height: 1.6;
        }
        .verify-link {
          display: inline-block;
          padding: 10px 20px;
          font-size: 16px;
          color: #ffffff;
          background-color: #28a745;
          text-decoration: none;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">Email Verification</div>
        <div class="email-body">
          <p>Hello,</p>
          <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the link below:</p>
          <a class="verify-link" href="${link}/${userId}">Verify Email Address</a>
          <p>Thank you,<br>Heavens</p>
        </div>
        <p style="color: #777; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    </body>
  </html>
`;


module.exports = { passwordResetTemplate, emailVerificationTemplate };
