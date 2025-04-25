import nodemailer from "nodemailer";
import { BusinessProfile, Support } from "@shared/schema";

interface EmailContent {
  businessProfile: BusinessProfile;
  supportResources: Support[];
  insights: string[];
}

interface EmailResult {
  success: boolean;
  error?: string;
}

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT || "2525"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "user",
    pass: process.env.SMTP_PASS || "password",
  },
});

export const mailer = {
  async sendResultsEmail(to: string, content: EmailContent): Promise<EmailResult> {
    try {
      // Create HTML email content
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Business Support Matches</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #0D5661;
                color: white;
                padding: 20px;
                text-align: center;
              }
              .section {
                margin-bottom: 30px;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
              }
              .section-title {
                color: #0D5661;
                margin-top: 0;
                border-bottom: 2px solid #D99E32;
                padding-bottom: 10px;
              }
              .resource {
                margin-bottom: 20px;
                border-left: 4px solid #0D5661;
                padding-left: 15px;
              }
              .resource-title {
                margin: 0 0 10px 0;
                color: #0D5661;
              }
              .resource-type {
                display: inline-block;
                background-color: #88B2A7;
                color: white;
                padding: 4px 8px;
                border-radius: 3px;
                font-size: 12px;
                margin-bottom: 10px;
              }
              .insight-list {
                padding-left: 20px;
              }
              .insight-list li {
                margin-bottom: 10px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #666;
                margin-top: 30px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0D5661;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Your Business Support Matches</h1>
                <p>Ethically-guided support options for your business journey</p>
              </div>
              
              <div class="section">
                <h2 class="section-title">Your Business Profile</h2>
                <p><strong>Business Type:</strong> ${content.businessProfile.businessType}</p>
                <p><strong>Industry:</strong> ${content.businessProfile.industrySector}</p>
                <p><strong>Team Size:</strong> ${content.businessProfile.teamSize}</p>
                <p><strong>Funding Stage:</strong> ${content.businessProfile.fundingStage}</p>
                <p><strong>Growth Goals:</strong> ${content.businessProfile.growthGoals.join(", ")}</p>
              </div>
              
              <div class="section">
                <h2 class="section-title">Recommended Support Options</h2>
                ${content.supportResources.map(resource => `
                  <div class="resource">
                    <span class="resource-type">${resource.type.toUpperCase()}</span>
                    <h3 class="resource-title">${resource.name}</h3>
                    <p>${resource.description}</p>
                    ${resource.amount ? `<p><strong>Amount:</strong> ${resource.amount}</p>` : ''}
                    ${resource.deadline ? `<p><strong>Deadline:</strong> ${resource.deadline}</p>` : ''}
                    ${resource.duration ? `<p><strong>Duration:</strong> ${resource.duration}</p>` : ''}
                    <a href="${resource.applyUrl}" class="button">${resource.applyText || "Apply Now"}</a>
                  </div>
                `).join('')}
              </div>
              
              <div class="section">
                <h2 class="section-title">Personalized Insights</h2>
                <ul class="insight-list">
                  ${content.insights.map(insight => `
                    <li>${insight}</li>
                  `).join('')}
                </ul>
              </div>
              
              <div class="footer">
                <p>© ${new Date().getFullYear()} Business Baraka Finder. All rights reserved.</p>
                <p>This email was sent to ${to} because you requested your business support matches.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Send the email
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM || "support@businessbarakafinder.com",
        to,
        subject: "Your Business Support Matches from Business Baraka Finder",
        html,
      });

      console.log("Email sent:", info.messageId);
      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      };
    }
  },
};
