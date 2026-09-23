import 'dotenv/config';
import { sendNotificationEmail, isEmailConfigured } from '../server/providers/notifications';

/**
 * Warning-email smoke test — Brevo SMTP via Nodemailer only.
 * Sends to the configured sender address so no external recipient is contacted.
 */
(async () => {
  const to = process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] || process.env.EMAIL_FROM || '';
  console.log('email provider configured:', isEmailConfigured());
  console.log('recipient (self-send):', to);
  const result = await sendNotificationEmail({
    to,
    eventType: 'Flood',
    severity: 'Severe',
    location: 'Wayanad, Kerala (brevo smtp smoke test)',
    description: 'Automated pipeline smoke test — Aapda Drishti warning email delivered via Brevo SMTP (Nodemailer).',
    sourceSummary: '',
    sourceUrls: ['https://example.com/alert'],
    platformUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  });
  console.log('sendNotificationEmail ->', JSON.stringify(result));
  process.exit(result.success ? 0 : 1);
})();
