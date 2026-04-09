import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "the1stkidschannel@gmail.com",
    pass: process.env.GMAIL_PASS, // Needs an App Password if using Gmail 
  },
});

export async function sendApprovalEmail(type: "kyc" | "compliance", id: string, details: any) {
  const isProd = process.env.NODE_ENV === "production";
  const baseUrl = isProd ? "https://amanah-proptech.vercel.app" : "http://localhost:3000";
  
  const approvalLink = `${baseUrl}/api/admin/approve?type=${type}&id=${id}`;
  
  const subject = type === "kyc" 
    ? `🚨 ACTION REQUIRED: B2B Onboarding Approval for ${details.name}`
    : `🚨 ACTION REQUIRED: Sharia Compliance Override for ${details.fileName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #03362a;">Amanah PropTech: Human-in-the-Loop Request</h2>
      <p>A process requires manual intervention and approval from a compliance officer.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #c5a059; margin-bottom: 20px;">
        ${type === "kyc" ? `
          <strong>Type:</strong> Institutional KYC / KYB Onboarding<br/>
          <strong>Name / Firm:</strong> ${details.name}<br/>
          <strong>Country:</strong> ${details.nationality}<br/>
          <strong>Reason for Flag:</strong> ${details.reason}
        ` : `
          <strong>Type:</strong> Sharia Compliance Engine (AAOIFI)<br/>
          <strong>Document:</strong> ${details.fileName}<br/>
          <strong>Finding:</strong> ${details.findingsSummary}
        `}
      </div>

      <p>Please review the details in your dashboard or click the button below to instantly approve and release the process in the database.</p>
      
      <a href="${approvalLink}" style="display: inline-block; background: #c5a059; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
        Approve via 1-Click
      </a>
      
      <p style="margin-top: 30px; font-size: 0.8rem; color: #888;">This is an automated message from the Amanah PropTech Infrastructure.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Amanah Compliance Server" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER || "the1stkidschannel@gmail.com", // Sent to the admin
      subject,
      html,
    });
    console.log(`[Email] HITL Approval mail sent for ${type} id: ${id}`);
  } catch (e) {
    console.error("[Email] Failed to send HITL email:", e);
  }
}
