import 'dotenv/config';

/**
 * Failure-path check: a deliberately wrong SMTP password must return
 * success:false (EAUTH) — never a fake success. Bounded to 30s.
 */
process.env.BREVO_SMTP_KEY = 'xsmtpsib-0000000000-badkey';
const { sendNotificationEmail } = await import('../server/providers/notifications');

const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('SMTP timeout >30s')), 30_000));

(async () => {
  try {
    const result = await Promise.race([
      sendNotificationEmail({
        to: 'pandora.fusion.frixion@gmail.com',
        eventType: 'Flood',
        severity: 'Severe',
        location: 'failure-path test',
        description: 'should fail',
        sourceSummary: '',
        sourceUrls: [],
        platformUrl: 'http://localhost:5173',
      }),
      timeout,
    ]);
    console.log('result:', JSON.stringify(result));
    if (result.success) {
      console.error('BUG: bad key reported success');
      process.exit(1);
    }
    console.log('OK — bad credentials correctly return success:false');
    process.exit(0);
  } catch (err) {
    console.error('unexpected:', (err as Error).message);
    process.exit(1);
  }
})();
