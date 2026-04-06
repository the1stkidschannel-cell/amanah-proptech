import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';

const execPromise = util.promisify(exec);

// Open Claw Telegram Remote Control Webhook Endpoint
// This acts as the command center for Open Claw to manage the Amanah PropTech agents autonomously.

export async function POST(req: Request) {
  try {
    // Basic structural check for incoming Telegram hook
    const body = await req.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ status: 'ok', message: 'No text found' }, { status: 200 });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();

    // Verify Authorization (using an environment variable for the Telegram Bot Token or a specific Open Claw ID)
    // For now, we accept commands assuming the webhook URL is secret.

    console.log(`[OPEN CLAW] Received command from ${chatId}: ${text}`);

    let replyText = "Command not recognized. Available commands: /audit, /status, /outreach";

    // Route Open Claw Commands
    if (text === '/status') {
       // Return AUM and compliance status
       replyText = "Amanah PropTech System Status:\n- Compliance: eWpG & BaFin Tied-Agent (PLANNED)\n- Engine: Turbo Mode ACTIVE\n- Goal: $500M AUM\n- Status: MVP Phase";
    } else if (text === '/audit') {
       // Trigger the Deal Source Auditor
       replyText = "Initiating Deal Source Auditor...";
       try {
         const scriptPath = path.join(process.cwd(), 'scripts', 'deal_source_auditor.js');
         const { stdout } = await execPromise(`node ${scriptPath}`);
         replyText = `Audit Complete:\n\n${stdout.substring(0, 1500)}`; // Send back script output
       } catch (error: any) {
         replyText = `Error running audit: ${error.message}`;
       }
    } else if (text === '/outreach') {
       replyText = "Starting B2B Playwright Outreach Agent... (Check server logs)";
       // We launch it detached so we don't block the webhook response
       try {
         const scriptPath = path.join(process.cwd(), 'scripts', 'outreach_bot.js');
         // Fire and forget
         exec(`node ${scriptPath}`);
       } catch (e) {
         console.error(e);
       }
    }

    // Normally we would use the Telegram Bot API to send the message back to chatId here.
    // fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, { ... })
    
    return NextResponse.json({ 
      status: 'ok', 
      processedCommand: text,
      response: replyText 
    });

  } catch (error) {
    console.error('[OPEN CLAW WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
